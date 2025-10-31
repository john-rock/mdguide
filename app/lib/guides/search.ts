import FlexSearch from "flexsearch";
import type { Guide, SearchResult } from "@/app/types/guide";

// Create search index
const searchIndex = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["title", "content"],
    store: ["slug", "title", "description", "stepId", "stepTitle"],
  },
  tokenize: "forward",
  cache: true,
});

let isIndexBuilt = false;

/**
 * Build search index from all guides
 */
export function buildSearchIndex(guides: Guide[]): void {
  if (isIndexBuilt) return;

  guides.forEach((guide) => {
    // Index the guide title and description
    searchIndex.add({
      id: `${guide.slug}`,
      slug: guide.slug,
      title: guide.metadata.title,
      description: guide.metadata.description,
      content: `${guide.metadata.title} ${guide.metadata.description}`,
    });

    // Index each step
    guide.steps.forEach((step) => {
      searchIndex.add({
        id: `${guide.slug}-${step.id}`,
        slug: guide.slug,
        title: guide.metadata.title,
        description: guide.metadata.description,
        stepId: step.id,
        stepTitle: step.title,
        content: `${step.title} ${step.content}`,
      });
    });
  });

  isIndexBuilt = true;
}

/**
 * Search the index
 */
export function search(query: string, limit = 10): SearchResult[] {
  if (!query.trim()) return [];

  const results = searchIndex.search(query, {
    limit,
    enrich: true,
  });

  const searchResults: SearchResult[] = [];
  const seen = new Set<string>();

  // Flatten and deduplicate results
  results.forEach((result: any) => {
    result.result.forEach((item: any) => {
      const key = `${item.slug}-${item.stepId || ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        searchResults.push({
          slug: item.slug,
          title: item.title,
          description: item.description,
          stepId: item.stepId,
          stepTitle: item.stepTitle,
          score: 1, // FlexSearch doesn't provide scores
        });
      }
    });
  });

  return searchResults.slice(0, limit);
}

/**
 * Reset the search index (useful for rebuilding)
 */
export function resetSearchIndex(): void {
  isIndexBuilt = false;
}
