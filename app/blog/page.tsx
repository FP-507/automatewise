import type { Metadata } from "next";
import { Fragment } from "react";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog — All Articles",
  description: `Browse all workflow automation articles, tutorials, and tool comparisons on ${SITE.name}.`,
  openGraph: {
    title: `Blog — ${SITE.name}`,
    description: `Browse all workflow automation articles, tutorials, and tool comparisons on ${SITE.name}.`,
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <div className="mt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">
              All Articles
            </h1>
            <p className="mt-1 text-text-secondary">
              {articles.length} guides on workflow automation, no-code tools, and productivity.
            </p>
          </div>
        </div>
      </div>

      <AdSlot position="header" className="my-8" />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <Fragment key={article.slug}>
            <ArticleCard article={article} index={i > 5 ? i + 1 : i} />
            {i === 5 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <AdSlot position="between-posts" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <AdSlot position="footer" className="mt-12" />
    </div>
  );
}
