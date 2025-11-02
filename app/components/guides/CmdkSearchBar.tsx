"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as Dialog from "@radix-ui/react-dialog";
import type { SearchResult, GuideListItem } from "@/app/types/guide";

/**
 * Props for CmdkSearchBar component
 */
export interface CmdkSearchBarProps {
  /** Async function to perform search and return results */
  onSearch: (query: string) => Promise<SearchResult[]>;
  /** Whether to show "Back to Home" button */
  showBackToHome?: boolean;
  /** Slug of the current guide (for within-guide navigation) */
  currentGuideSlug?: string;
  /** Title of the current guide */
  currentGuideTitle?: string;
  /** Callback when a step is selected (for within-guide navigation) */
  onStepSelect?: (stepIndex: number) => void;
}

/**
 * Command palette search bar component
 *
 * Advanced search interface using cmdk library with:
 * - Keyboard shortcut (Cmd/Ctrl+K) to open
 * - Full-text search across guides and steps
 * - Tag-based filtering
 * - Navigation to guides and specific steps
 * - "Back to Home" option when in a guide
 *
 * @param props - Component props
 */
export function CmdkSearchBar({ onSearch, showBackToHome = false, currentGuideSlug, currentGuideTitle, onStepSelect }: CmdkSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [guides, setGuides] = useState<GuideListItem[]>([]);
  const [searchAllGuides, setSearchAllGuides] = useState(false);
  const router = useRouter();

  // Toggle command menu with Cmd/Ctrl + K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch guides when dialog opens
  useEffect(() => {
    if (open && guides.length === 0) {
      fetch("/api/guides")
        .then((res) => res.json())
        .then((data) => setGuides(data))
        .catch(() => setGuides([]));
    }
  }, [open, guides.length]);

  // Extract all unique tags from guides
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    guides.forEach((guide) => {
      guide.metadata.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [guides]);

  // Filter guides by selected tag
  const filteredGuides = useMemo(() => {
    if (!selectedTag) return [];
    return guides.filter((guide) =>
      guide.metadata.tags?.includes(selectedTag)
    );
  }, [guides, selectedTag]);

  // Perform search whenever query changes
  useEffect(() => {
    if (query.trim()) {
      onSearch(query).then((searchResults) => {
        // Filter results to current guide if we have a guide slug and not searching all
        if (currentGuideSlug && !searchAllGuides) {
          const filtered = searchResults.filter(result => result.slug === currentGuideSlug);
          setResults(filtered);
        } else {
          setResults(searchResults);
        }
      });
      setSelectedTag(null); // Clear tag selection when searching
    } else {
      setResults([]);
    }
  }, [query, onSearch, currentGuideSlug, searchAllGuides]);

  const handleSelect = (result: SearchResult) => {
    // If we're on the same guide and have a step callback, use it for direct navigation
    if (result.slug === currentGuideSlug && result.stepIndex !== undefined && onStepSelect) {
      onStepSelect(result.stepIndex);
      setOpen(false);
      setQuery("");
      setResults([]);
      setSelectedTag(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Otherwise, navigate to the new guide/page
      const url = result.stepIndex !== undefined
        ? `/${result.slug}#step-${result.stepIndex + 1}`
        : `/${result.slug}`;
      router.push(url);
      setOpen(false);
      setQuery("");
      setResults([]);
      setSelectedTag(null);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setQuery(""); // Clear search when selecting a tag
  };

  const handleGuideSelect = (slug: string) => {
    router.push(`/${slug}`);
    setOpen(false);
    setQuery("");
    setSelectedTag(null);
  };

  const handleBack = () => {
    setSelectedTag(null);
    setQuery("");
  };

  const handleBackToHome = () => {
    router.push("/");
    setOpen(false);
    setQuery("");
    setSelectedTag(null);
    setSearchAllGuides(false);
  };

  const handleSearchAllGuides = () => {
    setSearchAllGuides(true);
    setQuery(""); // Clear query to trigger re-search if needed
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="group relative w-full max-w-lg rounded-lg border border-zinc-300 bg-white px-4 py-2 pl-10 text-left text-sm text-zinc-500 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600"
      >
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Search guides...</span>
        <kbd className="pointer-events-none absolute right-3 top-2 hidden h-5 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-xs font-medium text-zinc-600 opacity-100 sm:flex dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command palette dialog */}
      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Search guides"
        className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg translate-x-[-50%] overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <VisuallyHidden.Root>
          <Dialog.Title>Search guides</Dialog.Title>
        </VisuallyHidden.Root>

        <div className="relative">
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-zinc-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search guides..."
            className="w-full border-0 border-b border-zinc-200 bg-transparent px-4 py-3 pl-10 text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-400"
          />
        </div>

        <Command.List className="max-h-96 overflow-y-auto px-2 py-2">
          <Command.Empty className="py-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {query ? `No results found for "${query}"` : "No filters available"}
          </Command.Empty>

          {/* Show navigation options when on a guide page */}
          {showBackToHome && !query && !selectedTag && (
            <Command.Group heading={currentGuideSlug && !searchAllGuides ? `Searching in "${currentGuideTitle}"` : undefined} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400">
              <Command.Item
                value="back-to-home"
                onSelect={handleBackToHome}
                className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-3 text-sm outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
              >
                <svg
                  className="h-4 w-4 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">Back to main page</span>
              </Command.Item>
              {currentGuideSlug && !searchAllGuides && (
                <Command.Item
                  value="search-all-guides"
                  onSelect={handleSearchAllGuides}
                  className="mx-2 mb-1 flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-3 text-sm outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                >
                  <svg
                    className="h-4 w-4 text-zinc-600 dark:text-zinc-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">Search all guides</span>
                </Command.Item>
              )}
            </Command.Group>
          )}

          {/* Show search results when user has typed a query */}
          {query && results.length > 0 && (
            <Command.Group
              heading={currentGuideSlug && !searchAllGuides ? `Results in this guide` : "Results"}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400">
              {results.map((result, index) => (
                <Command.Item
                  key={`${result.slug}-${result.stepId || index}`}
                  value={`${result.title} ${result.stepTitle || ""}`}
                  onSelect={() => handleSelect(result)}
                  className="relative flex cursor-pointer select-none items-start rounded-md px-2 py-3 text-sm outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                >
                  <div className="flex-1">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {result.title}
                    </div>
                    {result.stepTitle && (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        → {result.stepTitle}
                      </div>
                    )}
                    {result.description && !result.stepTitle && (
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {result.description}
                      </div>
                    )}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Show tag filters when no search query and no tag selected */}
          {!query && !selectedTag && allTags.length > 0 && (
            <Command.Group heading="Filter by Tag" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400">
              {allTags.map((tag) => (
                <Command.Item
                  key={tag}
                  value={tag}
                  onSelect={() => handleTagSelect(tag)}
                  className="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-3 text-sm outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                >
                  <svg
                    className="h-4 w-4 text-zinc-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {tag}
                  </span>
                  <span className="ml-auto text-xs text-zinc-500">
                    {guides.filter((g) => g.metadata.tags?.includes(tag)).length}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Show filtered guides when a tag is selected */}
          {selectedTag && filteredGuides.length > 0 && (
            <>
              <Command.Group>
                <Command.Item
                  value="back-to-filters"
                  onSelect={handleBack}
                  className="mx-2 mb-2 flex cursor-pointer select-none items-center gap-1 rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                >
                  <svg
                    className="h-4 w-4 text-zinc-600 dark:text-zinc-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-zinc-600 dark:text-zinc-400">Back to filters</span>
                </Command.Item>
              </Command.Group>
              <Command.Group heading={`Guides tagged with "${selectedTag}"`} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:[&_[cmdk-group-heading]]:text-zinc-400">
                {filteredGuides.map((guide) => (
                  <Command.Item
                    key={guide.slug}
                    value={guide.metadata.title}
                    onSelect={() => handleGuideSelect(guide.slug)}
                    className="relative flex cursor-pointer select-none items-start rounded-md px-2 py-3 text-sm outline-none aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {guide.metadata.title}
                      </div>
                      {guide.metadata.description && (
                        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {guide.metadata.description}
                        </div>
                      )}
                      {guide.metadata.tags && guide.metadata.tags.length > 1 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {guide.metadata.tags
                            .filter((t) => t !== selectedTag)
                            .slice(0, 3)
                            .map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}
        </Command.List>
      </Command.Dialog>

      {/* Backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm dark:bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
