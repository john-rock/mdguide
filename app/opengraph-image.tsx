import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/config/site";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const alt = `${siteConfig.metadata.title} - ${siteConfig.metadata.description}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Load Geist fonts
  const geistBold = await fs.readFile(
    path.join(process.cwd(), "public/fonts/Geist-Bold.ttf")
  );
  const geistMedium = await fs.readFile(
    path.join(process.cwd(), "public/fonts/Geist-Medium.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          fontFamily: "Geist",
        }}
      >
        {/* Main title */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: "1040px",
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
            fontWeight: 500,
            lineHeight: 1.3,
            maxWidth: "900px",
          }}
        >
          {siteConfig.metadata.description}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistBold,
          weight: 700,
          style: "normal",
        },
        {
          name: "Geist",
          data: geistMedium,
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}
