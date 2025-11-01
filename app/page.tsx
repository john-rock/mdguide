"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SearchBar } from "@/app/components/guides/SearchBar";
import { TagFilter } from "@/app/components/guides/TagFilter";
import { Footer } from "@/app/components/Footer";
import { search as searchGuides } from "@/app/lib/guides/search";
import type { GuideListItem, SearchResult } from "@/app/types/guide";
import { siteConfig } from "@/app/config/site";

export default function HomePage() {
  const [guides, setGuides] = useState<GuideListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch guides list
    fetch("/api/guides")
      .then((res) => res.json())
      .then((data) => {
        setGuides(data);
        setIsLoading(false);
      })
      .catch(() => {
        // Fallback: use empty array if API not available yet
        setGuides([]);
        setIsLoading(false);
      });
  }, []);

  const handleSearch = (query: string): SearchResult[] => {
    return searchGuides(query);
  };

  // Extract all unique tags from guides
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    guides.forEach((guide) => {
      guide.metadata.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [guides]);

  // Filter guides by selected tags
  const filteredGuides = useMemo(() => {
    if (selectedTags.length === 0) {
      return guides;
    }
    return guides.filter((guide) => {
      return guide.metadata.tags?.some((tag) => selectedTags.includes(tag));
    });
  }, [guides, selectedTags]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading guides...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <div className="mx-auto flex-1 w-full max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            {siteConfig.homepage.title}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            {siteConfig.homepage.description}
          </p>
        </header>

        {/* Search bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Main content with sidebar */}
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left sidebar - Filter */}
          <aside className="lg:w-64 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-8">
              <TagFilter
                tags={allTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex-1">
            {/* Guides grid */}
            {filteredGuides.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-600 dark:text-zinc-400">
                  {guides.length === 0
                    ? "No guides available yet. Check back soon!"
                    : "No guides match the selected filters."}
                </p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/${guide.slug}`}
                    className="group rounded-lg border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
                  >
                    <h2 className="mb-2 text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                      {guide.metadata.title}
                    </h2>
                    {guide.metadata.description && (
                      <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                        {guide.metadata.description}
                      </p>
                    )}
                    {guide.metadata.tags && guide.metadata.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {guide.metadata.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
