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

export function getRelatedArticles(
  currentSlug: string,
  category: Category,
  limit = 3
): ArticleMeta[] {
  return getAllArticles()
    .filter((a) => a.slug !== currentSlug && a.category === category)
    .slice(0, limit);
}
