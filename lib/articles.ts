import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Article, ArticleMeta, Category } from "./types";

const articlesDirectory = path.join(process.cwd(), "content/articles");

function calculateReadingTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export function getAllArticleSlugs(): string[] {
  const files = fs.readdirSync(articlesDirectory);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getArticleMeta(slug: string): ArticleMeta {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated || undefined,
    category: data.category as Category,
    tags: data.tags || [],
    keywords: data.keywords || [],
    readingTime: calculateReadingTime(content),
    featured: data.featured || false,
  };
}

export async function getArticle(slug: string): Promise<Article> {
  const filePath = path.join(articlesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html, { sanitize: false }).process(content);
  const htmlContent = processed.toString();

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated || undefined,
    category: data.category as Category,
    tags: data.tags || [],
    keywords: data.keywords || [],
    readingTime: calculateReadingTime(content),
    content: htmlContent,
    featured: data.featured || false,
  };
}

export function getAllArticles(): ArticleMeta[] {
  const slugs = getAllArticleSlugs();
  const articles = slugs.map(getArticleMeta);
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticlesByCategory(category: Category): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getFeaturedArticles(): ArticleMeta[] {
  return getAllArticles().filter((a) => a.featured);
}

/**
 * Related articles, chosen by topic and balanced across the site.
 *
 * Picking purely by similarity would funnel most links to a handful of hub
 * articles; the previous position-based rotation spread links evenly but
 * paired unrelated topics. This does both: every article first receives
 * MIN_INBOUND links from the articles most similar to it, then the remaining
 * slots are filled by similarity with a penalty for articles that already
 * have plenty of inbound links. Deterministic across builds.
 */
const RELATED_LIMIT = 6;
const MIN_INBOUND = 3;

const STOPWORDS = new Set([
  "with", "your", "from", "that", "this", "best", "guide", "tutorial",
  "tools", "tool", "free", "using", "what", "2026", "vs", "and", "for",
  "the", "how", "automation", "automate", "automated", "workflow", "workflows",
]);

function topicTokens(a: ArticleMeta): Set<string> {
  const words = [...a.keywords, ...a.tags, a.title]
    .join(" ")
    .toLowerCase()
    .split(/[^a-z0-9.]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  return new Set(words);
}

function similarity(
  a: ArticleMeta,
  b: ArticleMeta,
  tokens: Map<string, Set<string>>
): number {
  const tagsA = new Set(a.tags.map((t) => t.toLowerCase()));
  const sharedTags = b.tags.filter((t) => tagsA.has(t.toLowerCase())).length;
  const tokA = tokens.get(a.slug)!;
  let sharedTokens = 0;
  for (const t of tokens.get(b.slug)!) if (tokA.has(t)) sharedTokens++;
  return sharedTags * 3 + sharedTokens * 2 + (a.category === b.category ? 2 : 0);
}

let relatedCache: Map<string, string[]> | null = null;

function buildRelatedMap(): Map<string, string[]> {
  const all = [...getAllArticles()].sort((a, b) => a.slug.localeCompare(b.slug));
  const tokens = new Map(all.map((a) => [a.slug, topicTokens(a)]));
  const sim = new Map<string, Map<string, number>>();
  for (const a of all) {
    const row = new Map<string, number>();
    for (const b of all) if (a.slug !== b.slug) row.set(b.slug, similarity(a, b, tokens));
    sim.set(a.slug, row);
  }
  const byScore = (row: Map<string, number>) =>
    [...row.entries()].sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]));

  const out = new Map<string, string[]>(all.map((a) => [a.slug, []]));
  const inbound = new Map<string, number>(all.map((a) => [a.slug, 0]));
  const link = (from: string, to: string) => {
    out.get(from)!.push(to);
    inbound.set(to, inbound.get(to)! + 1);
  };

  // Pass 1: guarantee each article MIN_INBOUND links from its closest peers.
  for (const target of all) {
    for (const [source] of byScore(sim.get(target.slug)!)) {
      if (inbound.get(target.slug)! >= MIN_INBOUND) break;
      const list = out.get(source)!;
      if (list.length < RELATED_LIMIT && !list.includes(target.slug)) {
        link(source, target.slug);
      }
    }
  }

  // Pass 2: fill remaining slots by similarity, damping already-popular pages.
  for (const source of all) {
    const list = out.get(source.slug)!;
    const candidates = byScore(sim.get(source.slug)!)
      .filter(([slug]) => !list.includes(slug))
      .map(([slug, score]) => [slug, score - inbound.get(slug)! * 1.5] as const)
      .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]));
    for (const [slug] of candidates) {
      if (list.length >= RELATED_LIMIT) break;
      link(source.slug, slug);
    }
    // Show the closest matches first.
    const row = sim.get(source.slug)!;
    list.sort((x, y) => row.get(y)! - row.get(x)! || x.localeCompare(y));
  }
  return out;
}

export function getRelatedArticles(currentSlug: string): ArticleMeta[] {
  relatedCache ??= buildRelatedMap();
  return (relatedCache.get(currentSlug) ?? []).map(getArticleMeta);
}
