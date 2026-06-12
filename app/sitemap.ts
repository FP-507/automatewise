import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { CATEGORY_INFO } from "@/lib/types";
import { SITE } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const categories = Object.keys(CATEGORY_INFO);

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE.url}/blog/${article.slug}`,
    lastModified: new Date(article.updated || article.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE.url}/categories/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
