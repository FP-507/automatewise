import Link from "next/link";
import type { ArticleMeta } from "@/lib/types";
import { CategoryBadge } from "./CategoryBadge";

interface ArticleCardProps {
  article: ArticleMeta;
  featured?: boolean;
  index?: number;
}

export function ArticleCard({ article, featured, index = 0 }: ArticleCardProps) {
  const date = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (featured) {
    return (
      <Link
        href={`/blog/${article.slug}`}
        className="card-hover group relative block overflow-hidden rounded-2xl border border-border bg-surface stagger-item"
        style={{ "--stagger-index": index } as React.CSSProperties}
      >
        {/* Gradient overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Accent line at top */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <CategoryBadge category={article.category} />
            <span className="text-xs text-text-muted">{date}</span>
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 opacity-60">
                <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.5v3.793l2.854 2.854a.5.5 0 01-.708.708l-3-3A.5.5 0 017.5 8.5V4.5a.5.5 0 011 0z" />
              </svg>
              {article.readingTime}
            </span>
          </div>
          <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-text transition-colors duration-200 group-hover:text-accent sm:text-3xl">
            {article.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-text-secondary line-clamp-2">
            {article.description}
          </p>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs text-text-muted transition-colors duration-200 group-hover:text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-all duration-300 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
              Read
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="card-hover group flex flex-col rounded-xl border border-border bg-surface p-5 stagger-item"
      style={{ "--stagger-index": index } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <CategoryBadge category={article.category} size="sm" />
        <span className="text-xs text-text-muted">{date}</span>
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-text transition-colors duration-200 group-hover:text-accent">
        {article.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-2">
        {article.description}
      </p>
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 opacity-60">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.5v3.793l2.854 2.854a.5.5 0 01-.708.708l-3-3A.5.5 0 017.5 8.5V4.5a.5.5 0 011 0z" />
          </svg>
          {article.readingTime}
        </span>
        <span className="flex items-center gap-1 text-xs font-medium text-accent opacity-0 transition-all duration-200 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0">
          Read
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
