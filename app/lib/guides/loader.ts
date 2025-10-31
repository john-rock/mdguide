import fs from "fs";
import path from "path";
import { parseGuideContent, parseGuideMetadata } from "./parser";
import type { Guide, GuideListItem } from "@/app/types/guide";

const GUIDES_DIRECTORY = path.join(process.cwd(), "app/guides/(content)");

/**
 * Get all guide slugs from the filesystem
 */
export function getAllGuideSlugs(): string[] {
  try {
    const entries = fs.readdirSync(GUIDES_DIRECTORY, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch (error) {
    // Directory doesn't exist yet
    return [];
  }
}

/**
 * Get a single guide by slug
 */
export function getGuideBySlug(slug: string): Guide | null {
  try {
    const guidePath = path.join(GUIDES_DIRECTORY, slug, "page.mdx");
    const fileContent = fs.readFileSync(guidePath, "utf-8");
    return parseGuideContent(fileContent, slug);
  } catch (error) {
    console.error(`Error loading guide ${slug}:`, error);
    return null;
  }
}

/**
 * Get all guides (metadata only, for listing pages)
 */
export function getAllGuides(): GuideListItem[] {
  const slugs = getAllGuideSlugs();
  const guides: GuideListItem[] = [];

  for (const slug of slugs) {
    try {
      const guidePath = path.join(GUIDES_DIRECTORY, slug, "page.mdx");
      const fileContent = fs.readFileSync(guidePath, "utf-8");
      const { metadata } = parseGuideMetadata(fileContent, slug);

      // Only include published guides
      if (metadata.published !== false) {
        guides.push({ slug, metadata });
      }
    } catch (error) {
      console.error(`Error loading guide metadata for ${slug}:`, error);
    }
  }

  return guides;
}

/**
 * Get all guides with full content (for search indexing)
 */
export function getAllGuidesWithContent(): Guide[] {
  const slugs = getAllGuideSlugs();
  const guides: Guide[] = [];

  for (const slug of slugs) {
    const guide = getGuideBySlug(slug);
    if (guide && guide.metadata.published !== false) {
      guides.push(guide);
    }
  }

  return guides;
}
