"use client";

import { useEffect } from "react";

type AdPosition = "header" | "sidebar" | "in-article" | "footer" | "between-posts";

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

/** AdSense publisher ID, e.g. ca-pub-1234567890123456. */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Optional ad unit IDs per position. Without one, the slot still renders an
 * auto-sized responsive unit, which AdSense fills once the site is approved.
 */
const AD_UNITS: Partial<Record<AdPosition, string | undefined>> = {
  header: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
  "in-article": process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE,
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER,
  "between-posts": process.env.NEXT_PUBLIC_ADSENSE_SLOT_BETWEEN_POSTS,
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set. Empty dashed
 * placeholder boxes used to ship to production, which pushed content down
 * and made pages look unfinished to readers and quality raters alike.
 */
export function AdSlot({ position, className = "" }: AdSlotProps) {
  if (!ADSENSE_CLIENT) return null;
  return (
    <AdUnit
      client={ADSENSE_CLIENT}
      slot={AD_UNITS[position]}
      position={position}
      className={className}
    />
  );
}

function AdUnit({
  client,
  slot,
  position,
  className,
}: {
  client: string;
  slot?: string;
  position: AdPosition;
  className: string;
}) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense throws if the unit was already filled (e.g. fast refresh).
    }
  }, []);

  return (
    <div className={`ad-slot ${className}`} data-ad-position={position}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        {...(slot ? { "data-ad-slot": slot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
