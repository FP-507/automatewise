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

export interface CategoryInfo {
  label: string;
  description: string;
  /** Unique introduction shown on the category page (one string per paragraph). */
  intro: string[];
  /** Slugs of the guides to read first, shown above the full list. */
  pillars: string[];
}

export const CATEGORY_INFO: Record<Category, CategoryInfo> = {
  "getting-started": {
    label: "Getting Started",
    description:
      "Beginner-friendly guides to workflow automation and no-code tools",
    intro: [
      "New to automation? Start here. These guides explain what workflow automation is, the vocabulary you will run into, and how the major no-code platforms work, without assuming any programming background.",
      "If you only read three things, read what workflow automation is, pick a platform from the beginner tutorials for Zapier, Make or n8n, and build the first workflow they walk you through. Everything else on the site builds on those basics.",
    ],
    pillars: [
      "what-is-workflow-automation",
      "getting-started-with-zapier",
      "getting-started-with-make",
      "getting-started-with-n8n",
    ],
  },
  "tool-comparisons": {
    label: "Tool Comparisons",
    description:
      "In-depth comparisons of popular automation platforms and no-code tools",
    intro: [
      "Choosing a platform is the decision that is hardest to undo, because every workflow you build afterwards is tied to it. These comparisons cover pricing at realistic volumes, how each tool meters usage, integrations, self-hosting and the trade-offs that only show up after a few months of use.",
      "Head-to-head comparisons help when you are down to two options; the alternatives pages help when a tool you already use has become too expensive or too limited.",
    ],
    pillars: [
      "zapier-vs-make-vs-n8n",
      "best-automation-tools-small-business",
      "best-free-automation-tools",
      "n8n-vs-zapier",
    ],
  },
  "how-to": {
    label: "How-To Guides",
    description:
      "Step-by-step tutorials for building automations and workflows",
    intro: [
      "Step-by-step tutorials for automating specific tasks and specific apps. Each one walks through a complete workflow: the trigger, every action, how to test it and what to do when it fails.",
      "Task guides (data entry, invoices, follow-up emails, reports) are platform-agnostic and show the same workflow in more than one tool. App guides (HubSpot, Notion, Slack, Shopify, Stripe and more) go deep on a single product's automation features and integrations.",
    ],
    pillars: [
      "automate-data-entry",
      "automate-email-marketing",
      "automate-invoice-processing",
      "ai-workflow-automation",
    ],
  },
  "use-cases": {
    label: "Use Cases",
    description:
      "Real-world automation strategies for different industries and roles",
    intro: [
      "Automation looks different in a law firm than in an online store. These guides start from the business instead of the tool: the repetitive work a given industry or role actually deals with, which workflows pay off first, and the compliance or customer-experience constraints to respect.",
    ],
    pillars: [
      "automation-for-freelancers",
      "automation-for-ecommerce",
      "automation-for-marketing-agencies",
      "automation-for-customer-support",
    ],
  },
  advanced: {
    label: "Advanced",
    description:
      "Advanced strategies, ROI analysis, and scaling your automation setup",
    intro: [
      "Once a handful of workflows run your business, new problems appear: silent failures, credentials scattered across tools, costs that grow with volume and automations nobody remembers building. These guides cover error handling, security, monitoring, ROI and scaling from ten workflows to hundreds.",
    ],
    pillars: [
      "error-handling-automation",
      "automation-security-best-practices",
      "workflow-automation-roi",
      "scaling-automation-workflows",
    ],
  },
};
