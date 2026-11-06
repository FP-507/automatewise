/**
 * Canonical origin of the site.
 *
 * Read from NEXT_PUBLIC_SITE_URL so moving to a custom domain is a single
 * environment variable change in Vercel (plus a redirect from the old host).
 * Trailing slashes are stripped because every caller appends paths.
 */
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://automatewise-six.vercel.app"
).replace(/\/+$/, "");

export const SITE = {
  name: "AutomateWise",
  tagline: "Master Workflow Automation Without Writing Code",
  description:
    "Learn workflow automation, compare no-code tools, and build powerful automations with step-by-step guides. Master n8n, Zapier, Make, and more.",
  url: SITE_URL,
  locale: "en_US",
  author: "AutomateWise",
  twitter: "@automatewise",
} as const;

/**
 * The person behind the site, shown as the article byline, on /about and in
 * the Article schema.
 *
 * Leave `name` empty and the site falls back to crediting the AutomateWise
 * organization everywhere, so a half-filled profile never ships.
 */
export const AUTHOR = {
  name: "",
  /** One or two sentences, first person or third person. */
  bio: "",
  linkedin: "",
  /** Optional extra profiles (GitHub, X, personal site). */
  sameAs: [] as string[],
} as const;

export const hasAuthor = AUTHOR.name.trim().length > 0;

export const NAV_LINKS = [
  { href: "/blog", label: "Articles" },
  { href: "/tools", label: "Tools" },
  { href: "/categories/getting-started", label: "Start Here" },
  { href: "/categories/how-to", label: "Tutorials" },
  { href: "/categories/tool-comparisons", label: "Comparisons" },
  { href: "/about", label: "About" },
] as const;
