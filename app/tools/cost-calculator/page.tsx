import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CostCalculator } from "@/components/CostCalculator";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Automation Cost Calculator",
  description:
    "Compare what Zapier, Make, n8n, Pipedream and Power Automate would actually cost at your volume. Free calculator, no signup.",
  keywords: [
    "automation cost calculator",
    "zapier pricing calculator",
    "make vs zapier cost",
    "n8n cost comparison",
    "automation platform pricing",
  ],
  alternates: { canonical: "/tools/cost-calculator" },
  openGraph: {
    title: "Automation Cost Calculator",
    description:
      "Compare what Zapier, Make, n8n, Pipedream and Power Automate would actually cost at your volume.",
    type: "website",
  },
};

const FAQS = [
  {
    q: "How is automation pricing actually calculated?",
    a: "Each platform meters something different, which is why list prices mislead. Zapier bills per task, meaning every action step of every run. Make bills per operation, counting each module including the trigger. n8n and Pipedream bill per workflow run regardless of how many steps it contains. Power Automate bills per user and ignores volume entirely. A five-step workflow running 1,000 times monthly costs 5,000 tasks on Zapier, 6,000 operations on Make, and 1,000 executions on n8n.",
  },
  {
    q: "Why is Zapier more expensive than Make?",
    a: "Two reasons compound. Zapier counts every step as a billable task while including far fewer of them per plan, and its tiers rise faster. Make's Core plan provides 10,000 operations for $10.59 monthly against Zapier's Professional at $49.99 for 2,000 tasks. The gap widens as workflows gain steps, because step-billed pricing multiplies with complexity while run-billed pricing does not.",
  },
  {
    q: "Is self-hosted n8n really cheaper?",
    a: "At volume, substantially. Self-hosting removes execution limits entirely, so you pay only for a server, typically $10 to $20 monthly regardless of throughput. Below roughly 2,000 steps monthly the saving is small and the maintenance work outweighs it. The break-even usually arrives when a metered plan would cost around $50 monthly. This calculator excludes your own time, which is the real cost of self-hosting.",
  },
];

export default function CostCalculatorPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Automation Cost Calculator",
    url: `${SITE.url}/tools/cost-calculator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description:
      "Compare what Zapier, Make, n8n, Pipedream and Power Automate would cost at your workflow volume.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Tools", href: "/tools" },
            { label: "Cost Calculator" },
          ]}
        />

        <header className="animate-slide-up mt-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Automation Cost Calculator
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            Pricing pages are not comparable, because no two platforms meter the
            same thing. Enter your real volume and see what each one would
            charge.
          </p>
        </header>

        <section className="mt-8">
          <CostCalculator />
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-text">
            Why list prices mislead
          </h2>
          <p className="mt-4 leading-relaxed text-text-secondary">
            The headline number on a pricing page answers a question nobody
            asked. What decides your bill is the unit each platform counts, and
            those units are not equivalent.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 font-display font-semibold text-text">
                    Platform
                  </th>
                  <th className="py-3 pr-4 font-display font-semibold text-text">
                    Billing unit
                  </th>
                  <th className="py-3 font-display font-semibold text-text">
                    Effect of adding steps
                  </th>
                </tr>
              </thead>
              <tbody className="text-text-secondary">
                {[
                  ["Zapier", "Task (per action step)", "Cost rises with every step"],
                  ["Make", "Operation (per module)", "Cost rises with every module"],
                  ["n8n", "Execution (per run)", "No effect on cost"],
                  ["Pipedream", "Invocation (per run)", "No effect on cost"],
                  ["Power Automate", "User seat", "No effect on cost"],
                ].map(([p, unit, effect]) => (
                  <tr key={p} className="border-b border-border/60">
                    <td className="py-3 pr-4 font-medium text-text">{p}</td>
                    <td className="py-3 pr-4">{unit}</td>
                    <td className="py-3">{effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 leading-relaxed text-text-secondary">
            This is why a team with many simple automations and a team with a few
            complex ones reach opposite conclusions from the same pricing pages.
            Increase the actions-per-automation field above and the step-billed
            platforms separate from the run-billed ones immediately.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold text-text">
            Common questions
          </h2>
          <div className="mt-6 space-y-6">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-base font-semibold text-text">
                  {f.q}
                </h3>
                <p className="mt-2 leading-relaxed text-text-secondary">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-xl font-bold text-text">
            Choosing on more than price
          </h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            Cost decides fewer migrations than people expect. Integration
            coverage, who maintains the workflows, and whether data may leave
            your network usually matter more.
          </p>
          <ul className="mt-4 space-y-2 text-text-secondary">
            {[
              ["Zapier vs Make vs n8n", "/blog/zapier-vs-make-vs-n8n"],
              ["Best Zapier alternatives", "/blog/zapier-alternatives"],
              ["Best Make alternatives", "/blog/make-alternatives"],
              ["Best n8n alternatives", "/blog/n8n-alternatives"],
              ["Self-hosting n8n", "/blog/n8n-self-hosting-guide"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="font-medium text-accent hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <NewsletterSignup />
        </section>
      </div>
    </>
  );
}
