"use client";

import { useState } from "react";

export function NewsletterSignup({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div
        className={`animate-scale-in rounded-xl border border-accent/30 bg-accent/5 text-center ${
          compact ? "p-5" : "p-8 sm:p-10"
        }`}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-accent">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="font-display text-lg font-semibold text-text">
          Thanks for subscribing!
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          You&apos;ll get our best automation tips delivered weekly.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 text-accent">
            <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-.5a.5.5 0 00-.5.5v.217l6.5 3.827 6.5-3.827V4a.5.5 0 00-.5-.5H2zm13 2.383l-4.758 2.804L15 11.846V5.883zm-.034 7.215L10.93 9.95 8.39 11.447a.75.75 0 01-.78 0L5.07 9.95l-4.036 3.148A.5.5 0 002 13.5h12a.5.5 0 00.966-.402zM1 11.846l4.758-3.159L1 5.883v5.963z" />
          </svg>
          <p className="font-display text-sm font-semibold text-text">
            Get automation tips weekly
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
          <label htmlFor="newsletter-compact" className="sr-only">Email address</label>
          <input
            id="newsletter-compact"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-text-muted transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="submit"
            className="btn-primary rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-background"
          >
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent p-8 text-center sm:p-12">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[80px]" />

      <div className="relative">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-accent">
            <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="font-display text-2xl font-bold text-text sm:text-3xl">
          Level Up Your Automations
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-text-secondary">
          Join 5,000+ professionals getting weekly no-code automation tips,
          tutorials, and tool reviews.
        </p>
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-full" className="sr-only">Email address</label>
          <input
            id="newsletter-full"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-xl border border-border bg-surface/80 px-5 py-3.5 text-text placeholder:text-text-muted transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 backdrop-blur-sm"
          />
          <button
            type="submit"
            className="btn-primary rounded-xl bg-accent px-7 py-3.5 font-semibold text-background"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-xs text-text-muted">
          No spam, ever. Unsubscribe with one click.
        </p>
      </div>
    </section>
  );
}
