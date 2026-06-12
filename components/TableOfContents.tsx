"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState("");
  const [headings, setHeadings] = useState<TOCItem[]>([]);

  useEffect(() => {
    const matches = content.matchAll(/<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/g);
    const items: TOCItem[] = [];
    for (const match of matches) {
      items.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3].replace(/<[^>]*>/g, ""),
      });
    }

    if (items.length === 0) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const els = doc.querySelectorAll("h2, h3");
      els.forEach((el) => {
        const id =
          el.id ||
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") ||
          "";
        items.push({
          level: parseInt(el.tagName[1]),
          id,
          text: el.textContent || "",
        });
      });
    }

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-accent">
          <path d="M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        <h2 className="font-display text-xs font-semibold uppercase tracking-wider text-text-secondary">
          On This Page
        </h2>
      </div>
      <ul className="relative mt-3 space-y-0.5 border-l border-border pl-0">
        {headings.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`relative block rounded-r-md py-1.5 text-[13px] leading-snug transition-all duration-200 ${
                item.level === 3 ? "pl-7" : "pl-4"
              } ${
                activeId === item.id
                  ? "border-l-2 border-accent -ml-px font-medium text-accent bg-accent/5"
                  : "text-text-muted hover:text-text hover:bg-surface-alt border-l-2 border-transparent -ml-px"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
