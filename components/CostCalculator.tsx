"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/**
 * Pricing models differ in what they meter, which is the whole point of this
 * tool:
 *   - Zapier bills per TASK (every action step of every run)
 *   - Make bills per OPERATION (every module execution, roughly step + trigger)
 *   - n8n bills per EXECUTION (one workflow run, regardless of step count)
 *   - Power Automate bills per USER, independent of volume
 *   - Pipedream bills per INVOCATION (one workflow run)
 *
 * Figures are list prices as published in 2026 and are approximations for
 * comparison, not quotes.
 */

type Tier = { upTo: number; price: number };

const ZAPIER_TIERS: Tier[] = [
  { upTo: 100, price: 0 },
  { upTo: 750, price: 19.99 },
  { upTo: 2000, price: 49.99 },
  { upTo: 5000, price: 69 },
  { upTo: 10000, price: 89 },
  { upTo: 20000, price: 119 },
  { upTo: 50000, price: 169 },
  { upTo: 100000, price: 299 },
];

const MAKE_TIERS: Tier[] = [
  { upTo: 1000, price: 0 },
  { upTo: 10000, price: 10.59 },
  { upTo: 20000, price: 18.82 },
  { upTo: 40000, price: 29 },
  { upTo: 80000, price: 49 },
  { upTo: 150000, price: 99 },
];

const N8N_CLOUD_TIERS: Tier[] = [
  { upTo: 2500, price: 24 },
  { upTo: 10000, price: 60 },
  { upTo: 50000, price: 120 },
];

const PIPEDREAM_TIERS: Tier[] = [
  { upTo: 10000, price: 0 },
  { upTo: 50000, price: 29 },
  { upTo: 200000, price: 99 },
];

/** Returns the price of the cheapest tier that covers `usage`, or null if the
 *  volume exceeds every published tier (enterprise territory). */
function priceFor(tiers: Tier[], usage: number): number | null {
  const tier = tiers.find((t) => usage <= t.upTo);
  return tier ? tier.price : null;
}

/** Self-hosting cost is a server, sized by volume rather than metered. */
function selfHostedServerCost(runs: number): number {
  if (runs <= 50_000) return 10;
  if (runs <= 250_000) return 20;
  return 40;
}

type Result = {
  name: string;
  price: number | null;
  meter: string;
  usage: number;
  note: string;
  href: string;
};

const currency = (n: number) =>
  n === 0
    ? "Free"
    : `$${n.toLocaleString("en-US", {
        minimumFractionDigits: n % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      })}`;

export function CostCalculator() {
  const [workflows, setWorkflows] = useState(5);
  const [steps, setSteps] = useState(4);
  const [runs, setRuns] = useState(200);
  const [users, setUsers] = useState(3);

  const results = useMemo<Result[]>(() => {
    const totalRuns = Math.max(0, workflows * runs);
    const totalSteps = Math.max(0, totalRuns * steps);
    // Make counts the trigger module too.
    const totalOps = totalRuns * (steps + 1);

    const list: Result[] = [
      {
        name: "n8n (self-hosted)",
        price: totalRuns > 0 ? selfHostedServerCost(totalRuns) : 0,
        meter: "server only",
        usage: totalRuns,
        note: "Unlimited executions. You maintain the server.",
        href: "/blog/n8n-self-hosting-guide",
      },
      {
        name: "Make",
        price: priceFor(MAKE_TIERS, totalOps),
        meter: "operations",
        usage: totalOps,
        note: "Counts every module, including the trigger.",
        href: "/blog/getting-started-with-make",
      },
      {
        name: "Zapier",
        price: priceFor(ZAPIER_TIERS, totalSteps),
        meter: "tasks",
        usage: totalSteps,
        note: "Every action step of every run counts.",
        href: "/blog/getting-started-with-zapier",
      },
      {
        name: "n8n Cloud",
        price: priceFor(N8N_CLOUD_TIERS, totalRuns),
        meter: "executions",
        usage: totalRuns,
        note: "One run counts once, whatever its step count.",
        href: "/blog/getting-started-with-n8n",
      },
      {
        name: "Pipedream",
        price: priceFor(PIPEDREAM_TIERS, totalRuns),
        meter: "invocations",
        usage: totalRuns,
        note: "Step count does not affect price.",
        href: "/blog/zapier-vs-pipedream",
      },
      {
        name: "Power Automate",
        price: Math.max(0, users) * 15,
        meter: "per user",
        usage: Math.max(0, users),
        note: "Volume-independent. Premium connector plan.",
        href: "/blog/getting-started-with-power-automate",
      },
    ];

    return list.sort((a, b) => {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return a.price - b.price;
    });
  }, [workflows, steps, runs, users]);

  const totalRuns = Math.max(0, workflows * runs);
  const totalSteps = Math.max(0, totalRuns * steps);
  const cheapest = results.find((r) => r.price !== null);

  const fields = [
    {
      id: "workflows",
      label: "Automations you run",
      help: "Distinct workflows, not runs",
      value: workflows,
      set: setWorkflows,
      min: 1,
      max: 500,
    },
    {
      id: "steps",
      label: "Actions per automation",
      help: "Steps after the trigger",
      value: steps,
      set: setSteps,
      min: 1,
      max: 50,
    },
    {
      id: "runs",
      label: "Runs per automation / month",
      help: "How often each one fires",
      value: runs,
      set: setRuns,
      min: 1,
      max: 100000,
    },
    {
      id: "users",
      label: "People on the team",
      help: "Only affects per-seat pricing",
      value: users,
      set: setUsers,
      min: 1,
      max: 500,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-7">
      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.id}>
            <label
              htmlFor={f.id}
              className="block font-display text-sm font-semibold text-text"
            >
              {f.label}
            </label>
            <p className="mt-0.5 text-xs text-text-muted">{f.help}</p>
            <input
              id={f.id}
              type="number"
              inputMode="numeric"
              min={f.min}
              max={f.max}
              value={f.value}
              onChange={(e) => {
                const n = Number.parseInt(e.target.value, 10);
                f.set(Number.isFinite(n) ? Math.min(Math.max(n, 0), f.max) : 0);
              }}
              className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-text outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
          </div>
        ))}
      </div>

      {/* Derived volume */}
      <div
        className="mt-6 flex flex-wrap gap-x-8 gap-y-2 rounded-xl bg-accent/5 px-4 py-3 text-sm"
        aria-live="polite"
      >
        <span className="text-text-secondary">
          Workflow runs:{" "}
          <strong className="font-semibold text-text">
            {totalRuns.toLocaleString("en-US")}
          </strong>{" "}
          / month
        </span>
        <span className="text-text-secondary">
          Action steps:{" "}
          <strong className="font-semibold text-text">
            {totalSteps.toLocaleString("en-US")}
          </strong>{" "}
          / month
        </span>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-2.5">
        {results.map((r, i) => {
          const isBest = i === 0 && r.price !== null;
          return (
            <div
              key={r.name}
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border p-4 transition-colors ${
                isBest
                  ? "border-accent/40 bg-accent/5"
                  : "border-border bg-background"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={r.href}
                    className="font-display text-base font-semibold text-text transition-colors hover:text-accent"
                  >
                    {r.name}
                  </Link>
                  {isBest && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-background">
                      Cheapest
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">
                  {r.usage.toLocaleString("en-US")} {r.meter} &middot; {r.note}
                </p>
              </div>
              <div className="text-right">
                {r.price === null ? (
                  <>
                    <div className="font-display text-lg font-bold text-text-secondary">
                      Custom
                    </div>
                    <div className="text-xs text-text-muted">
                      above published tiers
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-display text-lg font-bold text-text">
                      {currency(r.price)}
                      {r.price > 0 && (
                        <span className="text-sm font-medium text-text-muted">
                          /mo
                        </span>
                      )}
                    </div>
                    {r.price > 0 && (
                      <div className="text-xs text-text-muted">
                        {currency(r.price * 12)} / year
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Takeaway */}
      {cheapest && (
        <p className="mt-6 text-sm leading-relaxed text-text-secondary">
          At this volume <strong className="text-text">{cheapest.name}</strong>{" "}
          is cheapest. The gap comes from what each platform meters: Zapier
          charges for every step, Make for every module including the trigger,
          while n8n and Pipedream charge once per workflow run. Raise the
          actions-per-automation field and watch the step-billed platforms pull
          away. See{" "}
          <Link
            href="/blog/zapier-vs-make-vs-n8n"
            className="font-medium text-accent hover:underline"
          >
            Zapier vs Make vs n8n
          </Link>{" "}
          for the capability side of the decision.
        </p>
      )}

      <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
        List prices published in 2026, used for comparison rather than quotation.
        Vendors change tiers and offer annual discounts, so confirm before
        committing. Self-hosted n8n shows a typical VPS cost and excludes your
        maintenance time.
      </p>
    </div>
  );
}
