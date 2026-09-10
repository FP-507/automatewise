import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { CATEGORY_INFO } from "@/lib/types";
import { SITE } from "@/lib/constants";

/**
 * Fixed date for pages whose content only changes when we edit them.
 *
 * These used to call `new Date()`, which stamped every deploy as a
 * modification. Google treats a sitemap whose lastmod values move on every
 * build as unreliable and stops using lastmod for the site entirely, which
 * costs us recrawl efficiency on the pages that genuinely did change.
 *
 * Bump this by hand when you actually edit /about, /tools or /privacy.
 */
const STATIC_PAGE_UPDATED = new Date("2026-09-10T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const categories = Object.keys(CATEGORY_INFO);

  const modifiedAt = (article: (typeof articles)[number]) =>
    new Date(article.updated || article.date);

  // Index pages are only as fresh as the newest article they list.
  const newestOf = (list: typeof articles) =>
    list.length > 0
      ? new Date(Math.max(...list.map((a) => modifiedAt(a).getTime())))
      : STATIC_PAGE_UPDATED;

  const newestOverall = newestOf(articles);

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE.url}/blog/${article.slug}`,
    lastModified: modifiedAt(article),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE.url}/categories/${cat}`,
    lastModified: newestOf(articles.filter((a) => a.category === cat)),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: SITE.url,
      lastModified: newestOverall,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE.url}/blog`,
      lastModified: newestOverall,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/tools`,
      lastModified: STATIC_PAGE_UPDATED,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // NOTE: /hire is intentionally absent. The route exists locally but is not
    // deployed, so listing it would submit a 404 to Google. Add it back here
    // once app/hire/page.tsx ships:
    // { url: `${SITE.url}/hire`, lastModified: STATIC_PAGE_UPDATED,
    //   changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE.url}/about`,
      lastModified: STATIC_PAGE_UPDATED,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE.url}/privacy`,
      lastModified: STATIC_PAGE_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...categoryEntries,
    ...articleEntries,
  ];
}
