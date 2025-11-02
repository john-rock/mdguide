import { NextResponse } from "next/server";
import { getAllGuidesWithContent } from "@/app/lib/guides/loader";
import { generateLlmsTxt } from "@/app/lib/guides/llmsTxtGenerator";
import { siteConfig } from "@/app/config/site";

export const dynamic = "force-static";

/**
 * GET /llms.txt
 * Returns an llms.txt file containing all published guide content
 * This file is designed to be crawled by LLMs for documentation purposes
 */
export async function GET() {
  // Check if llms.txt is enabled
  if (!siteConfig.llmsTxt?.enabled) {
    return new NextResponse("llms.txt is disabled", { status: 404 });
  }

  try {
    // Get all published guides with full content
    const guides = getAllGuidesWithContent();

    // Generate llms.txt content
    const content = generateLlmsTxt(guides);

    // Return as plain text with appropriate headers
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating llms.txt:", error);
    return new NextResponse("Error generating llms.txt", { status: 500 });
  }
}
