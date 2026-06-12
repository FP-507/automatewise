import Link from "next/link";
import type { ArticleMeta } from "@/lib/types";
import { CategoryBadge } from "./CategoryBadge";

export function RelatedArticles({ articles }: { articles: ArticleMeta[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border pt-10">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <path d="M6.122.392a1.75 1.75 0 011.756 0l5.25 3.045c.54.313.872.89.872 1.514V7.25a.75.75 0 01-1.5 0V5.677L7.75 8.43v6.09a.75.75 0 01-1.5 0V8.43L.872 5.677A1.75 1.75 0 010 4.164V4.95c0-.624.332-1.2.872-1.514L6.122.392zM7 .95L1.872 4 7 7.049 12.128 4 7 .95zM.872 6.89L6.25 9.97v4.476L.872 11.39A1.75 1.75 0 010 9.876V6.89zm7.378 3.08l5.378-3.12v3.006c0 .624-.332 1.2-.872 1.514L7.75 14.446V9.97z" />
          </svg>
        </div>
        <h2 className="font-display text-xl font-bold text-text">
          Related Articles
        </h2>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="card-hover group rounded-xl border border-border bg-surface p-5 stagger-item"
            style={{ "--stagger-index": i } as React.CSSProperties}
          >
            <CategoryBadge category={article.category} size="sm" />
            <h3 className="mt-3 font-display text-base font-semibold leading-snug text-text transition-colors duration-200 group-hover:text-accent">
              {article.title}
            </h3>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 opacity-60">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.5v3.793l2.854 2.854a.5.5 0 01-.708.708l-3-3A.5.5 0 017.5 8.5V4.5a.5.5 0 011 0z" />
                </svg>
                {article.readingTime}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-all duration-200 group-hover:opacity-100">
                Read
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
