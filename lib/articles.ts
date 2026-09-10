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
 * Picks related articles using a rotating window over the category.
 *
 * The previous implementation took the first N articles of the category from a
 * date-sorted list, so every article in a category linked to the same few
 * newest posts. That concentrated all internal link equity on ~3 articles per
 * category and left the rest with zero inbound internal links, which starves
 * them of crawl priority.
 *
 * Rotating by the article's own position means the article at index i links to
 * i+1, i+2, ... (wrapping). Every article receives exactly `limit` inbound
 * internal links, and the result stays deterministic across builds.
 */
export function getRelatedArticles(
  currentSlug: string,
  category: Category,
  limit = 6
): ArticleMeta[] {
  const all = getAllArticles();
  const pool = all.filter((a) => a.category === category);
  const index = pool.findIndex((a) => a.slug === currentSlug);
  const start = index === -1 ? 0 : index;

  const related: ArticleMeta[] = [];
  // step starts at 1 so the current article is never included.
  for (let step = 1; step < pool.length && related.length < limit; step++) {
    related.push(pool[(start + step) % pool.length]);
  }

  // Categories smaller than `limit` get topped up from the rest of the site,
  // also rotated by position so the fallback spreads out instead of always
  // pointing at the same articles.
  if (related.length < limit) {
    const others = all.filter(
      (a) => a.category !== category && a.slug !== currentSlug
    );
    const offset = all.findIndex((a) => a.slug === currentSlug);
    const base = offset === -1 ? 0 : offset;
    for (let step = 0; step < others.length && related.length < limit; step++) {
      related.push(others[(base + step) % others.length]);
    }
  }

  return related;
}
