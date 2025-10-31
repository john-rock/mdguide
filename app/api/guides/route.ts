import { NextResponse } from "next/server";
import { getAllGuides, getAllGuidesWithContent } from "@/app/lib/guides/loader";
import { buildSearchIndex } from "@/app/lib/guides/search";

export async function GET() {
  try {
    // Get all guides
    const guides = getAllGuides();

    // Build search index on first request
    const guidesWithContent = getAllGuidesWithContent();
    buildSearchIndex(guidesWithContent);

    return NextResponse.json(guides);
  } catch (error) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
}
