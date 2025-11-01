"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/app/types/guide";

interface SearchBarProps {
  onSearch: (query: string) => SearchResult[];
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Keyboard shortcut: Cmd/Ctrl + K to focus search
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        const input = searchRef.current?.querySelector("input");
        input?.focus();
      }

      // ESC to close
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      const searchResults = onSearch(value);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const url = result.stepId
      ? `/${result.slug}#${result.stepId}`
      : `/${result.slug}`;
    router.push(url);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search guides... (⌘K)"
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 pl-10 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
        />
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
      </div>

      {/* Search results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <ul className="max-h-96 overflow-y-auto py-2">
            {results.map((result, index) => (
              <li key={`${result.slug}-${result.stepId || index}`}>
                <button
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
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
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results message */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-zinc-200 bg-white p-4 text-center text-sm text-zinc-600 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
