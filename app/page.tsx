import { getAllArticles, getFeaturedArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSlot } from "@/components/AdSlot";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { CATEGORY_INFO } from "@/lib/types";
import Link from "next/link";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "getting-started": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "tool-comparisons": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0-4h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "how-to": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  "use-cases": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  advanced: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function HomePage() {
  const allArticles = getAllArticles();
  const featured = getFeaturedArticles().slice(0, 2);
  const recent = allArticles.filter((a) => !a.featured).slice(0, 9);
  const categories = Object.entries(CATEGORY_INFO);

  return (
    <>
      {/* ── Hero ──────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Background gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
          <div className="absolute right-1/4 bottom-0 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-accent/3 blur-[100px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              No-code workflow automation guides
            </div>

            <h1 className="animate-slide-up font-display text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Automate Smarter,{" "}
              <span className="gradient-text">Not Harder</span>
            </h1>
            <p className="animate-slide-up mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl" style={{ animationDelay: "100ms" }}>
              Step-by-step guides to workflow automation with no-code tools.
              Master n8n, Zapier, Make, and more — no programming required.
            </p>
            <div
              className="animate-slide-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                href="/categories/getting-started"
                className="btn-primary inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-background"
              >
                Start Learning
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center rounded-xl border border-border px-7 py-3.5 font-medium text-text transition-all duration-200 hover:bg-surface hover:border-text-muted"
              >
                Browse All Articles
              </Link>
            </div>

            {/* Social proof */}
            <div
              className="animate-fade-in mt-10 flex items-center justify-center gap-6 text-sm text-text-muted"
              style={{ animationDelay: "400ms" }}
            >
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-accent">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm11.78-1.72a.75.75 0 00-1.06-1.06L7 8.94 5.28 7.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" />
                </svg>
                30+ in-depth guides
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-accent">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm11.78-1.72a.75.75 0 00-1.06-1.06L7 8.94 5.28 7.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" />
                </svg>
                100% free
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" />
              <span className="hidden items-center gap-1.5 sm:flex">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-accent">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm11.78-1.72a.75.75 0 00-1.06-1.06L7 8.94 5.28 7.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" />
                </svg>
                Updated weekly
              </span>
            </div>
          </div>
        </div>
      </section>

      <AdSlot position="header" className="mx-auto max-w-4xl px-4 py-6" />

      {/* ── Featured Articles ─────────────────── */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-text">
              Featured Articles
            </h2>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {featured.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                featured
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Latest Articles ───────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z" />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-bold text-text">
              Latest Articles
            </h2>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
          >
            View all
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recent.slice(0, 6).map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>

        <AdSlot position="between-posts" className="my-10" />

        {recent.length > 6 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recent.slice(6, 9).map((article, i) => (
              <ArticleCard key={article.slug} article={article} index={i + 6} />
            ))}
          </div>
        )}
      </section>

      {/* ── Browse by Topic ───────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
              <path d="M1.5 1.75a.75.75 0 00-1.5 0v12.5c0 .414.336.75.75.75H15a.75.75 0 000-1.5H1.5V1.75z" />
              <path d="M3.526 10.317a.75.75 0 000 1.06l.793.794a.75.75 0 001.06 0L8 9.553l2.621 2.618a.75.75 0 001.06 0l.793-.794a.75.75 0 000-1.06L9.061 6.903a1.5 1.5 0 00-2.122 0L3.526 10.317z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-text">
            Browse by Topic
          </h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([slug, info], i) => (
            <Link
              key={slug}
              href={`/categories/${slug}`}
              className="card-hover group flex items-start gap-4 rounded-xl border border-border bg-surface p-5 stagger-item"
              style={{ "--stagger-index": i } as React.CSSProperties}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-all duration-200 group-hover:bg-accent group-hover:text-background">
                {CATEGORY_ICONS[slug] || (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold text-text transition-colors duration-200 group-hover:text-accent">
                  {info.label}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {info.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <NewsletterSignup />
      </section>

      <AdSlot position="footer" className="mx-auto max-w-4xl px-4 pb-8" />
    </>
  );
}
