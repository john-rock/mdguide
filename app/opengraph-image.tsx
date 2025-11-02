import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/config/site";

export const runtime = "nodejs";
export const alt = `${siteConfig.metadata.title} - ${siteConfig.metadata.description}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          color: "white",
        }}
      >
        {/* Main title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: "bold",
            lineHeight: 1.1,
            maxWidth: "1040px",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          {siteConfig.metadata.title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 36,
            opacity: 0.9,
            fontWeight: "500",
            lineHeight: 1.3,
            maxWidth: "900px",
            textAlign: "center",
          }}
        >
          {siteConfig.metadata.description}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
