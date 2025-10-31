"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchBar } from "@/app/components/guides/SearchBar";
import { search as searchGuides, buildSearchIndex } from "@/app/lib/guides/search";
import type { GuideListItem, SearchResult } from "@/app/types/guide";

// This would be fetched from the server in a real implementation
// For now, we'll use client-side only to avoid build issues
export default function GuidesPage() {
  const [guides, setGuides] = useState<GuideListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading guides...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Guides
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Step-by-step guides to help you get started and learn advanced features.
          </p>
        </header>

        {/* Search bar */}
        <div className="mb-12">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Guides grid */}
        {guides.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No guides available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
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
  );
}
