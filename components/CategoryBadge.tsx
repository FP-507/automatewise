import Link from "next/link";
import type { Category } from "@/lib/types";
import { CATEGORY_INFO } from "@/lib/types";

const CATEGORY_COLORS: Record<Category, string> = {
  "getting-started": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15",
  "tool-comparisons": "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/15",
  "how-to": "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/15",
  "use-cases": "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/15",
};

interface CategoryBadgeProps {
  category: Category;
  size?: "sm" | "md";
  asLink?: boolean;
}

export function CategoryBadge({
  category,
  size = "md",
  asLink = false,
}: CategoryBadgeProps) {
  const info = CATEGORY_INFO[category];
  const colors = CATEGORY_COLORS[category];
  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-[10px]" : "px-3 py-1 text-xs";

  const className = `inline-block rounded-full border font-semibold transition-colors duration-200 ${colors} ${sizeClasses}`;

  if (asLink) {
    return (
      <Link href={`/categories/${category}`} className={className}>
        {info.label}
      </Link>
    );
  }

  return <span className={className}>{info.label}</span>;
}
