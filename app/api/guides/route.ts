import { NextResponse } from "next/server";
import { getAllGuides } from "@/app/lib/guides/loader";

export async function GET() {
  try {
    // Get all guides (metadata only, no content)
    const guides = getAllGuides();

    return NextResponse.json(guides);
  } catch (error) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
}
