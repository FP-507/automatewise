export const SITE = {
  name: "AutomateWise",
  tagline: "Master Workflow Automation Without Writing Code",
  description:
    "Learn workflow automation, compare no-code tools, and build powerful automations with step-by-step guides. Master n8n, Zapier, Make, and more.",
  url: "https://automatewise.vercel.app",
  locale: "en_US",
  author: "AutomateWise",
  twitter: "@automatewise",
} as const;

export const NAV_LINKS = [
  { href: "/blog", label: "Articles" },
  { href: "/categories/getting-started", label: "Start Here" },
  { href: "/categories/how-to", label: "Tutorials" },
  { href: "/categories/tool-comparisons", label: "Comparisons" },
  { href: "/about", label: "About" },
] as const;
