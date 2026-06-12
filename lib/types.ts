export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: Category;
  tags: string[];
  keywords: string[];
  readingTime: string;
  content: string;
  featured?: boolean;
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  category: Category;
  tags: string[];
  keywords: string[];
  readingTime: string;
  featured?: boolean;
}

export type Category =
  | "getting-started"
  | "tool-comparisons"
  | "how-to"
  | "use-cases"
  | "advanced";

export const CATEGORY_INFO: Record<
  Category,
  { label: string; description: string }
> = {
  "getting-started": {
    label: "Getting Started",
    description:
      "Beginner-friendly guides to workflow automation and no-code tools",
  },
  "tool-comparisons": {
    label: "Tool Comparisons",
    description:
      "In-depth comparisons of popular automation platforms and no-code tools",
  },
  "how-to": {
    label: "How-To Guides",
    description:
      "Step-by-step tutorials for building automations and workflows",
  },
  "use-cases": {
    label: "Use Cases",
    description:
      "Real-world automation strategies for different industries and roles",
  },
  advanced: {
    label: "Advanced",
    description:
      "Advanced strategies, ROI analysis, and scaling your automation setup",
  },
};
