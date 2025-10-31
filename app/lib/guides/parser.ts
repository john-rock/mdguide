import matter from "gray-matter";
import type { Guide, GuideMetadata, Step } from "@/app/types/guide";

/**
 * Slugify a string to create a valid ID
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Extract steps from MDX content
 * Each ## heading becomes a step
 */
export function extractSteps(content: string): Step[] {
  const steps: Step[] = [];
  const lines = content.split("\n");

  let currentStep: Step | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    // Check if line is a ## heading (step marker)
    const h2Match = line.match(/^##\s+(.+)$/);

    if (h2Match) {
      // Save previous step if exists
      if (currentStep) {
        currentStep.content = currentContent.join("\n").trim();
        steps.push(currentStep);
      }

      // Start new step
      const title = h2Match[1];
      currentStep = {
        id: slugify(title),
        title,
        content: "",
        level: 2,
      };
      currentContent = [];
    } else if (currentStep) {
      // Add line to current step content
      currentContent.push(line);
    }
  }

  // Don't forget the last step
  if (currentStep) {
    currentStep.content = currentContent.join("\n").trim();
    steps.push(currentStep);
  }

  return steps;
}

/**
 * Parse MDX file content and extract metadata + steps
 */
export function parseGuideContent(
  fileContent: string,
  slug: string
): Guide {
  const { data, content } = matter(fileContent);

  const metadata: GuideMetadata = {
    title: data.title || "Untitled Guide",
    description: data.description || "",
    author: data.author,
    date: data.date ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date)) : undefined,
    tags: data.tags || [],
    published: data.published !== false, // default to true
  };

  const steps = extractSteps(content);

  return {
    slug,
    metadata,
    steps,
    rawContent: content,
  };
}

/**
 * Extract just metadata from MDX content (lighter operation)
 */
export function parseGuideMetadata(
  fileContent: string,
  slug: string
): { slug: string; metadata: GuideMetadata } {
  const { data } = matter(fileContent);

  const metadata: GuideMetadata = {
    title: data.title || "Untitled Guide",
    description: data.description || "",
    author: data.author,
    date: data.date ? (data.date instanceof Date ? data.date.toISOString().split('T')[0] : String(data.date)) : undefined,
    tags: data.tags || [],
    published: data.published !== false,
  };

  return { slug, metadata };
}
