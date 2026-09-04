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

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(article.date).toLocaleDateString("en-US", dateFormatOptions);
  const updatedDate = article.updated
    ? new Date(article.updated).toLocaleDateString("en-US", dateFormatOptions)
    : null;

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

  const faqEntries: { q: string; a: string }[] = [];
  {
    const headings = article.content.match(/<h2>(.*?)<\/h2>/g) || [];
    const sections = article.content.split(/<h2>/);
    sections.slice(1).forEach((section, i) => {
      const heading = headings[i]
        ?.replace(/<\/?h2>/g, "")
        .replace(/<[^>]*>/g, "");
      if (!heading) return;
      const isQuestion =
        heading.includes("?") ||
        /^(What|Why|How|When|Which|Is|Are|Can|Do|Does|Should|Where|Will)/i.test(heading);
      if (isQuestion) {
        const text = section
          .split(/<h[23]>/)[0]
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 300);
        if (text.length > 50) {
          faqEntries.push({ q: heading, a: text });
        }
      }
    });
  }

  const faqJsonLd =
    faqEntries.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqEntries.slice(0, 6).map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }
      : null;

  const howToSteps: { name: string; text: string }[] = [];
  if (article.category === "how-to") {
    const headings = article.content.match(/<h2>(.*?)<\/h2>/g) || [];
    const sections = article.content.split(/<h2>/);
    sections.slice(1).forEach((section, i) => {
      const heading = headings[i]
        ?.replace(/<\/?h2>/g, "")
        .replace(/<[^>]*>/g, "");
      if (!heading) return;
      const isStep =
        /^(step\s*\d|phase\s*\d|method\s*\d|tier\s*\d|part\s*\d|stage\s*\d|option\s*\d|way\s*\d|week\s*\d|day\s*\d|workflow\s*\d|scenario\s*\d|automation\s*\d|rule\s*\d|journey\s*\d|zap\s*\d|script\s*\d|(flow|external)\s+(workflow|integration)\s*\d|integration\s*\d|\d+[\.\):\-])/i.test(heading) ||
        /^(set up|setting up|install|create|build|connect|configure|add|enable|import|export|choose|automate|implement|define|use|integrate|monitor|test|deploy|launch|start|prepare|design|plan|gather|collect|measure|calculate|review|optimize|track|write|run|open|select|click|navigate|sign|log in|download|upload|register|map|assign|schedule|trigger|send|check|verify|validate|format|parse|transform|process|handle|manage|update|delete|remove|migrate|sync|link|embed|customize|adjust|modify)/i.test(heading);
      if (isStep) {
        const text = section
          .split(/<h[23]>/)[0]
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 300);
        if (text.length > 30) {
          howToSteps.push({ name: heading, text });
        }
      }
    });
  }

  const howToJsonLd =
    howToSteps.length >= 3
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: article.title,
          description: article.description,
          step: howToSteps.slice(0, 10).map((step, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: step.name,
            text: step.text,
          })),
        }
      : null;

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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
        />
      )}

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
            {updatedDate && (
              <>
                <span className="h-1 w-1 rounded-full bg-text-muted" />
                <span className="inline-flex items-center gap-1.5 text-accent">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 opacity-70">
                    <path d="M1.705 8.005a.75.75 0 01.834.656 5.5 5.5 0 009.592 2.97l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-1.38-1.38A7.001 7.001 0 011.05 8.84a.75.75 0 01.656-.834zM8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l1.38 1.38A7.001 7.001 0 0114.95 7.16a.75.75 0 11-1.49.178A5.5 5.5 0 008 2.5z" />
                  </svg>
                  Updated <time dateTime={article.updated}>{updatedDate}</time>
                </span>
              </>
            )}
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
