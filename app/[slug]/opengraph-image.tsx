import { ImageResponse } from "next/og";
import { getGuideBySlug } from "@/app/lib/guides/loader";
import { siteConfig } from "@/app/config/site";

export const runtime = "nodejs";
export const alt = "Guide Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;

  // Load the guide
  const guide = getGuideBySlug(slug);

  if (!guide) {
    // Return a fallback image
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 60,
            background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Guide Not Found
        </div>
      ),
      {
        ...size,
      }
    );
  }

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
          justifyContent: "space-between",
          padding: "80px",
          color: "white",
        }}
      >
        {/* Top section with site name */}
        <div
          style={{
            fontSize: 32,
            opacity: 0.8,
            fontWeight: "500",
          }}
        >
          {siteConfig.metadata.title}
        </div>

        {/* Middle section with guide title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: "bold",
              lineHeight: 1.2,
              maxWidth: "1040px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {guide.metadata.title}
          </div>
        </div>

        {/* Bottom section with metadata */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            fontSize: 24,
            opacity: 0.7,
          }}
        >
          {guide.metadata.author && (
            <div style={{ display: "flex" }}>By {guide.metadata.author}</div>
          )}
          {guide.steps.length > 0 && (
            <div style={{ display: "flex" }}>
              {guide.steps.length} {guide.steps.length === 1 ? "step" : "steps"}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
