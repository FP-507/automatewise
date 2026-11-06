import type { Metadata } from "next";
import Link from "next/link";
import { SITE, AUTHOR, hasAuthor } from "@/lib/constants";
import { getAllArticles } from "@/lib/articles";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE.name} — your guide to mastering workflow automation and no-code tools.`,
};

export default function AboutPage() {
  const articleCount = getAllArticles().length;
  const profileJsonLd = hasAuthor
    ? {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url: `${SITE.url}/about`,
        mainEntity: {
          "@type": "Person",
          name: AUTHOR.name,
          description: AUTHOR.bio || undefined,
          url: `${SITE.url}/about`,
          sameAs: [AUTHOR.linkedin, ...AUTHOR.sameAs].filter(Boolean),
        },
      }
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {profileJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
        />
      )}
      <Breadcrumbs items={[{ label: "About" }]} />

      <div className="animate-slide-up mt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold text-text sm:text-4xl">
            About {SITE.name}
          </h1>
        </div>
      </div>

      <div className="prose mt-8">
        <p>
          We believe that automation should be accessible to everyone — not just
          developers with years of coding experience. That&apos;s why we
          created AutomateWise: a resource dedicated to helping professionals,
          freelancers, and small business owners harness the power of workflow
          automation without writing a single line of code.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is simple: to make workflow automation understandable,
          practical, and accessible. We publish in-depth guides, honest tool
          comparisons, and step-by-step tutorials that help you automate
          repetitive tasks, streamline your business processes, and reclaim
          your most valuable resource — time.
        </p>

        <h2>What We Cover</h2>
        <p>
          With <strong>{articleCount} in-depth articles</strong> across five categories,
          we cover the full spectrum of workflow automation:
        </p>
        <ul>
          <li>
            <strong>No-Code Automation Platforms</strong> — Deep dives into
            n8n, Zapier, Make, Power Automate, Airtable, Notion, and IFTTT
          </li>
          <li>
            <strong>Step-by-Step Tutorials</strong> — From{" "}
            <Link href="/blog/webhook-automation-guide">webhooks</Link> and{" "}
            <Link href="/blog/api-integration-without-code">API integrations</Link>{" "}
            to{" "}
            <Link href="/blog/ai-workflow-automation">AI-powered workflows</Link>
          </li>
          <li>
            <strong>Tool Comparisons</strong> — Honest, data-driven{" "}
            <Link href="/tools">comparisons</Link> to help you choose the
            right platform
          </li>
          <li>
            <strong>Industry Use Cases</strong> — Automation strategies for{" "}
            <Link href="/blog/automation-for-saas-startups">SaaS startups</Link>,{" "}
            <Link href="/blog/automation-for-healthcare">healthcare</Link>,{" "}
            <Link href="/blog/automation-for-real-estate">real estate</Link>,{" "}
            <Link href="/blog/automation-for-law-firms">law firms</Link>,{" "}
            <Link href="/blog/automation-for-education">education</Link>,{" "}
            <Link href="/blog/automation-for-nonprofits">nonprofits</Link>,{" "}
            <Link href="/blog/automation-for-restaurants">restaurants</Link>,{" "}
            and more
          </li>
          <li>
            <strong>Advanced Strategies</strong> —{" "}
            <Link href="/blog/error-handling-automation">Error handling</Link>,{" "}
            <Link href="/blog/automation-security-best-practices">security</Link>,{" "}
            <Link href="/blog/scaling-automation-workflows">scaling</Link>, and{" "}
            <Link href="/blog/workflow-automation-roi">ROI analysis</Link>
          </li>
        </ul>

        {hasAuthor && (
          <>
            <h2>Who Writes AutomateWise</h2>
            <p>
              AutomateWise is written and maintained by{" "}
              <strong>{AUTHOR.name}</strong>.
              {AUTHOR.bio ? <> {AUTHOR.bio}</> : null}
            </p>
            {AUTHOR.linkedin && (
              <p>
                You can find me on{" "}
                <a href={AUTHOR.linkedin} rel="me noopener" target="_blank">
                  LinkedIn
                </a>
                . Corrections and suggestions are always welcome.
              </p>
            )}
          </>
        )}

        <h2>How We Write</h2>
        <p>
          Every guide is checked against the tool&apos;s current documentation
          and pricing page, and we update articles when a platform changes how
          it works or what it costs. When an article is revised, the
          &ldquo;Updated&rdquo; date at the top changes with it.
        </p>
        <p>
          We don&apos;t get paid by the tools we review. Recommendations are
          based on features, pricing, and usability, not sponsorship deals.
        </p>

        <h2>Get Started</h2>
        <p>
          New to automation? Start with our{" "}
          <Link href="/categories/getting-started">beginner guides</Link>. Or
          browse our{" "}
          <Link href="/categories/tool-comparisons">tool comparisons</Link> to
          find the right platform for your needs.
        </p>
      </div>

      <div className="mt-14">
        <NewsletterSignup />
      </div>
    </div>
  );
}
