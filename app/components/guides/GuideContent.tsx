"use client";

import { GuideSidebar } from "./GuideSidebar";
import { StepSection } from "./StepSection";
import type { Guide } from "@/app/types/guide";

interface GuideContentProps {
  guide: Guide;
}

export function GuideContent({ guide }: GuideContentProps) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <GuideSidebar steps={guide.steps} title={guide.metadata.title} />

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
          {/* Guide header */}
          <header className="mb-12 border-b border-zinc-200 pb-8 dark:border-zinc-800">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              {guide.metadata.title}
            </h1>
            {guide.metadata.description && (
              <p className="text-xl leading-8 text-zinc-600 dark:text-zinc-400">
                {guide.metadata.description}
              </p>
            )}
            {(guide.metadata.author || guide.metadata.date) && (
              <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500">
                {guide.metadata.author && (
                  <span>By {guide.metadata.author}</span>
                )}
                {guide.metadata.date && <span>{guide.metadata.date}</span>}
              </div>
            )}
            {guide.metadata.tags && guide.metadata.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {guide.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Guide steps */}
          <div className="space-y-16">
            {guide.steps.map((step) => (
              <StepSection key={step.id} step={step} />
            ))}
          </div>

          {/* Footer navigation */}
          <footer className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <a
                href="/guides"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                ← Back to all guides
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
