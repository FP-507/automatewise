import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/articles";
import { CATEGORY_INFO, type Category } from "@/lib/types";
import { SITE } from "@/lib/constants";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import Link from "next/link";

const validCategories = Object.keys(CATEGORY_INFO) as Category[];

export function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_INFO[category as Category];
  if (!info) return {};

  return {
    title: `${info.label} — Automation Guides`,
    description: info.description,
    alternates: { canonical: `/categories/${category}` },
    openGraph: {
      title: `${info.label} — ${SITE.name}`,
      description: info.description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!validCategories.includes(category as Category)) {
    notFound();
  }

  const info = CATEGORY_INFO[category as Category];
  const articles = getArticlesByCategory(category as Category);
  const pillars = info.pillars
    .map((slug) => articles.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const pageUrl = `${SITE.url}/categories/${category}`;
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${info.label} — ${SITE.name}`,
    description: info.description,
    url: pageUrl,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE.url}/blog/${a.slug}`,
        name: a.title,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: info.label },
        ]}
      />

      <div className="mt-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
              <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">
              {info.label}
            </h1>
            <p className="mt-2 text-lg text-text-secondary">{info.description}</p>
            <div className="mt-3 flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-sm text-text-muted">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                  <path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                </svg>
                {articles.length} article{articles.length !== 1 ? "s" : ""}
              </span>
              <Link
                href="/blog"
                className="text-sm text-accent transition-colors hover:text-accent-hover"
              >
                View all categories &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-text-secondary">
        {info.intro.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      {pillars.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-text">
            Start with these guides
          </h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {pillars.map((article, i) => (
              <li key={article.slug}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="card-hover group flex h-full gap-4 rounded-xl border border-border bg-surface p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-display text-sm font-bold text-accent">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-display font-semibold leading-snug text-text transition-colors group-hover:text-accent">
                      {article.title}
                    </span>
                    <span className="mt-1 block text-sm text-text-muted">
                      {article.description}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <AdSlot position="header" className="my-8" />

      <h2 className="mb-5 mt-12 font-display text-xl font-bold text-text">
        All {info.label.toLowerCase()} ({articles.length})
      </h2>

      {articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/50 py-16 text-center">
          <p className="text-text-secondary">No articles in this category yet.</p>
          <Link
            href="/blog"
            className="mt-4 inline-flex text-sm font-medium text-accent hover:text-accent-hover"
          >
            Browse all articles &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      )}

      <AdSlot position="footer" className="mt-12" />
    </div>
  );
}
