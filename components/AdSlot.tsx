"use client";

type AdPosition = "header" | "sidebar" | "in-article" | "footer" | "between-posts";

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

const AD_DIMENSIONS: Record<AdPosition, { label: string; height: string }> = {
  header: { label: "Leaderboard (728x90)", height: "h-[90px]" },
  sidebar: { label: "Sidebar (300x250)", height: "h-[250px]" },
  "in-article": { label: "In-Article (336x280)", height: "h-[280px]" },
  footer: { label: "Footer Banner (728x90)", height: "h-[90px]" },
  "between-posts": { label: "Between Posts (728x90)", height: "h-[90px]" },
};

export function AdSlot({ position, className = "" }: AdSlotProps) {
  const { label, height } = AD_DIMENSIONS[position];

  return (
    <div className={`ad-slot ${className}`} data-ad-position={position}>
      {/*
        Replace this div with your AdSense code:
        <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      */}
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-border/60 ${height} bg-surface/30 text-xs text-text-muted`}
      >
        <span className="opacity-30">{label}</span>
      </div>
    </div>
  );
}
