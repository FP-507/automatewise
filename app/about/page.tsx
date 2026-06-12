import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NewsletterSignup } from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE.name} — your guide to mastering workflow automation and no-code tools.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
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
        <ul>
          <li>
            <strong>No-Code Automation Platforms</strong> — Deep dives into
            tools like n8n, Zapier, Make (Integromat), Power Automate, and
            IFTTT
          </li>
          <li>
            <strong>Step-by-Step Tutorials</strong> — Practical guides that
            walk you through building real automations from scratch
          </li>
          <li>
            <strong>Tool Comparisons</strong> — Honest, data-driven
            comparisons to help you choose the right tool for your needs
          </li>
          <li>
            <strong>Industry Use Cases</strong> — Automation strategies
            tailored to freelancers, agencies, ecommerce, HR, and more
          </li>
          <li>
            <strong>Advanced Strategies</strong> — ROI calculations, API
            integrations, and scaling techniques for power users
          </li>
        </ul>

        <h2>Why Trust Us?</h2>
        <p>
          We&apos;re practitioners, not just writers. Our team has hands-on
          experience building hundreds of automation workflows for businesses
          of all sizes. Every article we publish is based on real-world
          testing, not press releases or spec sheets.
        </p>
        <p>
          We don&apos;t get paid by the tools we review. Our recommendations
          are based on actual performance, pricing, and usability — not
          sponsorship deals.
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
