import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticleSlugs, getArticle, getRelatedArticles } from "@/lib/articles";
import { CATEGORY_INFO } from "@/lib/types";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryBadge } from "@/components/CategoryBadge";
import { TableOfContents } from "@/components/TableOfContents";
import { ShareButtons } from "@/components/ShareButtons";
import { AdSlot } from "@/components/AdSlot";
import { RelatedArticles } from "@/components/RelatedArticles";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await getArticle(slug);
    return {
      title: article.title,
      description: article.description,
      keywords: article.keywords,
      openGraph: {
        title: article.title,
        description: article.description,
        type: "article",
        publishedTime: article.date,
        ...(article.updated ? { modifiedTime: article.updated } : {}),
        authors: [SITE.author],
        tags: article.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: article.title,
        description: article.description,
      },
      alternates: {
        canonical: `/blog/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let article;
  try {
    article = await getArticle(slug);
  } catch {
    notFound();
  }

  const related = getRelatedArticles(slug, article.category);
  const categoryInfo = CATEGORY_INFO[article.category];

  const date = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    ...(article.updated ? { dateModified: article.updated } : {}),
    author: {
      "@type": "Organization",
      name: SITE.author,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/blog/${slug}`,
    },
    keywords: article.keywords.join(", "),
  };

  const contentWithIds = article.content.replace(
    /<h([23])>(.*?)<\/h[23]>/g,
    (_, level: string, text: string) => {
      const id = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            {
              label: categoryInfo.label,
              href: `/categories/${article.category}`,
            },
            { label: article.title },
          ]}
        />

        {/* ── Article Header ──────────────────── */}
        <header className="animate-slide-up mx-auto mt-8 max-w-3xl">
          <CategoryBadge category={article.category} asLink />
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-text sm:text-4xl lg:text-[2.75rem]">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            {article.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 opacity-60">
                <path d="M4.684 2.926a.5.5 0 00-.868 0L.453 8.596A.5.5 0 00.886 9.25h6.727a.5.5 0 00.434-.654L4.684 2.926zM8.5 8a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zm2.5-1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM.75 11.25a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75z" />
              </svg>
              <time dateTime={article.date}>{date}</time>
            </span>
            <span className="h-1 w-1 rounded-full bg-text-muted" />
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 opacity-60">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.5v3.793l2.854 2.854a.5.5 0 01-.708.708l-3-3A.5.5 0 017.5 8.5V4.5a.5.5 0 011 0z" />
              </svg>
              {article.readingTime}
            </span>
            <span className="h-1 w-1 rounded-full bg-text-muted" />
            <ShareButtons title={article.title} slug={slug} />
          </div>
        </header>

        <AdSlot position="header" className="mx-auto my-8 max-w-3xl" />

        {/* ── Content + Sidebar ───────────────── */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_260px]">
          <div className="min-w-0">
            <div
              className="prose mx-auto max-w-3xl lg:max-w-none"
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
            />

            <AdSlot
              position="in-article"
              className="mx-auto my-10 max-w-xl"
            />

            {/* Bottom share */}
            <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-border bg-surface p-5 lg:max-w-none">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-text-secondary">
                  Found this helpful? Share it with your network.
                </p>
                <ShareButtons title={article.title} slug={slug} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              <TableOfContents content={contentWithIds} />
              <NewsletterSignup compact />
              <AdSlot position="sidebar" />
            </div>
          </aside>
        </div>

        {/* ── Related + Newsletter ────────────── */}
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <RelatedArticles articles={related} />
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <NewsletterSignup />
        </div>
      </article>
    </>
  );
}
