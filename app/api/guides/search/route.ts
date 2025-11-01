import { NextResponse } from "next/server";
import { getAllGuidesWithContent } from "@/app/lib/guides/loader";
import { buildSearchIndex, search } from "@/app/lib/guides/search";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    // Build search index (will only build once due to isIndexBuilt flag)
    const guidesWithContent = getAllGuidesWithContent();
    buildSearchIndex(guidesWithContent);

    // Perform search
    const results = search(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error searching guides:", error);
    return NextResponse.json(
      { error: "Failed to search guides" },
      { status: 500 }
    );
  }
}
