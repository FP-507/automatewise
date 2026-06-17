import { ImageResponse } from "next/og";

export const alt = "AutomateWise — Master Workflow Automation Without Writing Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #09090b 0%, #131316 50%, #1c1c21 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 900,
              color: "#09090b",
            }}
          >
            A
          </div>
          <span
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.02em",
            }}
          >
            AutomateWise
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 800,
            color: "#fafafa",
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            maxWidth: "900px",
          }}
        >
          Master Workflow Automation
          <span style={{ color: "#f59e0b", marginLeft: "14px" }}>Without Code</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            color: "#a1a1aa",
            marginTop: "24px",
            textAlign: "center",
            maxWidth: "700px",
          }}
        >
          Step-by-step guides to n8n, Zapier, Make, and more. 30+ in-depth tutorials — 100% free.
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "1200px",
            height: "4px",
            display: "flex",
            background: "linear-gradient(90deg, transparent, #f59e0b, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
