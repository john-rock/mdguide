import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getGuideBySlug } from "@/app/lib/guides/loader";
import { siteConfig } from "@/app/config/site";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const stepParam = searchParams.get("step");

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400 });
    }

    // Load the guide
    const guide = getGuideBySlug(slug);

    if (!guide) {
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
          width: 1200,
          height: 630,
        }
      );
    }

    // Find the step if step parameter is provided
    let stepTitle: string | undefined;
    if (stepParam) {
      // Step parameter can be in format "step-N" where N is 1-indexed, or just "N"
      const stepMatch = stepParam.match(/^(?:step-)?(\d+)$/);
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1], 10);
        const stepIndex = stepNumber - 1; // Convert to 0-indexed
        if (stepIndex >= 0 && stepIndex < guide.steps.length) {
          stepTitle = guide.steps[stepIndex].title;
        }
      }
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

          {/* Middle section with guide title and optional step */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: stepTitle ? "24px" : "0",
            }}
          >
            <div
              style={{
                fontSize: stepTitle ? 56 : 72,
                fontWeight: "bold",
                lineHeight: 1.2,
                maxWidth: "1040px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {guide.metadata.title}
            </div>
            {stepTitle && (
              <div
                style={{
                  fontSize: 36,
                  opacity: 0.9,
                  fontWeight: "500",
                  lineHeight: 1.3,
                  maxWidth: "1040px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {stepTitle}
              </div>
            )}
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
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
