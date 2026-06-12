import Link from "next/link";
import { SITE } from "@/lib/constants";
import { CATEGORY_INFO } from "@/lib/types";

export function Footer() {
  const categories = Object.entries(CATEGORY_INFO);

  return (
    <footer className="mt-auto border-t border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 font-display text-lg font-bold text-text"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-background text-sm font-black transition-transform duration-200 group-hover:scale-110">
                A
              </span>
              {SITE.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              {SITE.description}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map(([slug, info]) => (
                <li key={slug}>
                  <Link
                    href={`/categories/${slug}`}
                    className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                  >
                    {info.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Popular
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/blog/n8n-vs-zapier"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  n8n vs Zapier
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/best-free-automation-tools"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  Best Free Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/what-is-workflow-automation"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  What Is Automation?
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/getting-started-with-n8n"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  Getting Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="text-sm text-text-muted transition-colors duration-200 hover:text-accent"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span>Built for the automation community</span>
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 text-accent">
              <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
