import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { AdSlot } from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Automation Tools Directory — Compare n8n, Zapier, Make & More",
  description:
    "Compare the best workflow automation tools side by side. Detailed profiles of n8n, Zapier, Make, Power Automate, and more with pricing, features, and recommendations.",
  alternates: { canonical: "/tools" },
};

const TOOLS = [
  {
    name: "n8n",
    tagline: "Open-source workflow automation",
    description:
      "Self-hostable automation platform with 400+ integrations, code nodes (JavaScript/Python), and native AI support. Best for technical users who want full control and cost efficiency.",
    pricing: "Free (self-hosted) / Cloud plans available",
    bestFor: "Developers, self-hosting, AI workflows, privacy-conscious teams",
    color: "#ea4b71",
    articles: [
      { href: "/blog/getting-started-with-n8n", label: "Getting Started Guide" },
      { href: "/blog/n8n-vs-zapier", label: "n8n vs Zapier" },
      { href: "/blog/n8n-vs-make", label: "n8n vs Make" },
      { href: "/blog/n8n-vs-power-automate", label: "n8n vs Power Automate" },
      { href: "/blog/n8n-self-hosting-guide", label: "Self-Hosting Guide" },
      { href: "/blog/connect-google-sheets-n8n", label: "Google Sheets + n8n" },
    ],
  },
  {
    name: "Zapier",
    tagline: "The most popular no-code automation",
    description:
      "The easiest automation platform with 7,000+ integrations. Guided step-by-step builder, massive template library, and built-in AI actions. Best for beginners and quick setups.",
    pricing: "Free (100 tasks/mo) / From $19.99/mo",
    bestFor: "Beginners, non-technical users, quick automations",
    color: "#ff4a00",
    articles: [
      { href: "/blog/getting-started-with-zapier", label: "Getting Started Guide" },
      { href: "/blog/n8n-vs-zapier", label: "n8n vs Zapier" },
      { href: "/blog/make-vs-zapier", label: "Make vs Zapier" },
      { href: "/blog/power-automate-vs-zapier", label: "Power Automate vs Zapier" },
      { href: "/blog/ifttt-vs-zapier-vs-make", label: "IFTTT vs Zapier vs Make" },
    ],
  },
  {
    name: "Make",
    tagline: "Visual automation for complex workflows",
    description:
      "Flowchart-style automation builder with powerful data transformation, routers, iterators, and error handling. More control than Zapier at a lower price point.",
    pricing: "Free (1,000 ops/mo) / From $9/mo",
    bestFor: "Power users, complex workflows, visual thinkers, budget-conscious teams",
    color: "#6d3bea",
    articles: [
      { href: "/blog/getting-started-with-make", label: "Getting Started Guide" },
      { href: "/blog/make-vs-zapier", label: "Make vs Zapier" },
      { href: "/blog/n8n-vs-make", label: "n8n vs Make" },
      { href: "/blog/make-vs-power-automate", label: "Make vs Power Automate" },
    ],
  },
  {
    name: "Power Automate",
    tagline: "Microsoft's enterprise automation",
    description:
      "Deep integration with Microsoft 365 ecosystem — Teams, Outlook, SharePoint, Dynamics 365. Unique desktop automation (RPA) for legacy apps without APIs.",
    pricing: "Included with M365 (limited) / From $15/user/mo",
    bestFor: "Microsoft-centric organizations, enterprise, desktop RPA",
    color: "#0066ff",
    articles: [
      { href: "/blog/power-automate-vs-zapier", label: "Power Automate vs Zapier" },
      { href: "/blog/n8n-vs-power-automate", label: "n8n vs Power Automate" },
      { href: "/blog/make-vs-power-automate", label: "Make vs Power Automate" },
    ],
  },
  {
    name: "Airtable",
    tagline: "Spreadsheet-database hybrid with automations",
    description:
      "Flexible database that doubles as an automation hub. Built-in automations, scripting, and deep integrations with external platforms for CRM, project management, and content workflows.",
    pricing: "Free (limited) / From $20/user/mo",
    bestFor: "Teams needing a flexible database with built-in automation",
    color: "#18bfff",
    articles: [
      { href: "/blog/airtable-automation-guide", label: "Airtable Automation Guide" },
    ],
  },
  {
    name: "Notion",
    tagline: "All-in-one workspace with database automations",
    description:
      "Notion's built-in database automations handle status changes, notifications, and page creation. Extend with external platforms via the Notion API for cross-tool workflows.",
    pricing: "Free (personal) / From $10/user/mo",
    bestFor: "Teams using Notion as their primary workspace",
    color: "#000000",
    articles: [
      { href: "/blog/notion-automation-guide", label: "Notion Automation Guide" },
    ],
  },
] as const;

const toolsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Best Workflow Automation Tools",
  description: "Compare the top workflow automation platforms for no-code automation.",
  numberOfItems: TOOLS.length,
  itemListElement: TOOLS.map((tool, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: tool.name,
    description: tool.description,
    url: `${SITE.url}/tools#${tool.name.toLowerCase().replace(/\s+/g, "-")}`,
  })),
};

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "Tools" }]} />

        <header className="animate-slide-up mt-8 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                <path d="M11.42 15.17l-5.384-3.19A1.875 1.875 0 015.25 10.3V6.614a1.875 1.875 0 01.786-1.529l5.384-3.19a1.875 1.875 0 011.16 0l5.384 3.19a1.875 1.875 0 01.786 1.529V10.3a1.875 1.875 0 01-.786 1.529l-5.384 3.19a1.875 1.875 0 01-1.16 0z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 12.75v6.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">
              Automation Tools
            </h1>
          </div>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            Compare the best workflow automation platforms. Find the right tool
            for your needs with our detailed profiles, pricing breakdowns, and
            head-to-head comparisons.
          </p>
        </header>

        {/* Quick comparison */}
        <div className="mt-10 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-semibold text-text">Platform</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Best For</th>
                <th className="px-4 py-3 text-left font-semibold text-text">Starting Price</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-text sm:table-cell">Self-Host</th>
              </tr>
            </thead>
            <tbody>
              {TOOLS.map((tool, i) => (
                <tr key={tool.name} className={i < TOOLS.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-4 py-3">
                    <a href={`#${tool.name.toLowerCase().replace(/\s+/g, "-")}`} className="font-semibold text-accent hover:underline">
                      {tool.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{tool.bestFor.split(",")[0]}</td>
                  <td className="px-4 py-3 text-text-secondary">{tool.pricing.split("/")[0]}</td>
                  <td className="hidden px-4 py-3 text-text-secondary sm:table-cell">
                    {tool.name === "n8n" ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/blog/best-automation-tools-2025"
            className="text-sm font-medium text-accent hover:underline"
          >
            Read our full 2025 comparison guide &rarr;
          </Link>
        </div>

        <AdSlot position="header" className="my-8" />

        {/* Tool profiles */}
        <div className="mt-6 space-y-8">
          {TOOLS.map((tool, i) => (
            <section
              key={tool.name}
              id={tool.name.toLowerCase().replace(/\s+/g, "-")}
              className="card-hover stagger-item rounded-xl border border-border bg-surface p-6 sm:p-8"
              style={{ "--stagger-index": i } as React.CSSProperties}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-lg"
                      style={{ backgroundColor: tool.color }}
                    >
                      {tool.name[0]}
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-bold text-text">
                        {tool.name}
                      </h2>
                      <p className="text-sm text-text-muted">{tool.tagline}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-accent/5 px-3 py-1.5 text-xs font-medium text-accent">
                  {tool.pricing.split("/")[0]}
                </div>
              </div>

              <p className="mt-4 leading-relaxed text-text-secondary">
                {tool.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {tool.bestFor.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-surface-alt px-2.5 py-1 text-xs text-text-muted"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>

              {tool.articles.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                    Related Guides
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tool.articles.map((a) => (
                      <Link
                        key={a.href}
                        href={a.href}
                        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-text transition-colors hover:border-accent/40 hover:text-accent"
                      >
                        {a.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        <AdSlot position="between-posts" className="my-10" />

        {/* CTA section */}
        <section className="mt-10 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center sm:p-10">
          <h2 className="font-display text-2xl font-bold text-text">
            Not sure which tool to pick?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-text-secondary">
            Our comparison guides break down the differences with real pricing
            data, feature matrices, and use-case recommendations.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/blog/best-automation-tools-2025"
              className="btn-primary inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-background"
            >
              2025 Complete Guide
            </Link>
            <Link
              href="/categories/tool-comparisons"
              className="inline-flex items-center rounded-xl border border-border px-6 py-3 font-medium text-text transition-all hover:bg-surface hover:border-text-muted"
            >
              All Comparisons
            </Link>
          </div>
        </section>

        <div className="mx-auto mt-14 max-w-2xl">
          <NewsletterSignup />
        </div>
      </div>
    </>
  );
}
