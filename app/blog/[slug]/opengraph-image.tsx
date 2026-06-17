import { ImageResponse } from "next/og";
import { getArticleMeta, getAllArticleSlugs } from "@/lib/articles";
import { CATEGORY_INFO } from "@/lib/types";

export const alt = "AutomateWise Article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

const CATEGORY_COLORS: Record<string, string> = {
  "getting-started": "#22c55e",
  "tool-comparisons": "#38bdf8",
  "how-to": "#8b5cf6",
  "use-cases": "#f59e0b",
  advanced: "#f43f5e",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleMeta(slug);
  const categoryColor = CATEGORY_COLORS[article.category] || "#f59e0b";
  const categoryLabel = CATEGORY_INFO[article.category].label;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #131316 50%, #1c1c21 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
        }}
      >
        {/* Top: category badge + reading time */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "100px",
              background: `${categoryColor}20`,
              border: `1px solid ${categoryColor}40`,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: categoryColor,
                display: "flex",
              }}
            />
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: categoryColor,
              }}
            >
              {categoryLabel}
            </span>
          </div>
          <span style={{ fontSize: "16px", color: "#71717a" }}>
            {article.readingTime}
          </span>
        </div>

        {/* Middle: title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: article.title.length > 60 ? "42px" : "50px",
              fontWeight: 800,
              color: "#fafafa",
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              maxWidth: "1000px",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {article.title}
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#a1a1aa",
              lineHeight: 1.5,
              maxWidth: "800px",
              display: "flex",
            }}
          >
            {article.description.length > 150
              ? article.description.slice(0, 147) + "..."
              : article.description}
          </div>
        </div>

        {/* Bottom: logo + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 900,
                color: "#09090b",
              }}
            >
              A
            </div>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#fafafa",
              }}
            >
              AutomateWise
            </span>
          </div>
          <span style={{ fontSize: "16px", color: "#71717a" }}>
            automatewise.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
