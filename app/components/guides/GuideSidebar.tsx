"use client";

import { useState } from "react";
import type { Step } from "@/app/types/guide";

/**
 * Props for GuideSidebar component
 */
export interface GuideSidebarProps {
  /** Array of steps in the guide */
  steps: Step[];
  /** Title of the guide */
  title: string;
  /** Index of the currently active step */
  currentStepIndex: number;
  /** Index of the highest completed step (for progress indication) */
  highestCompletedStep: number;
  /** Callback when a step is selected */
  onStepChange: (index: number) => void;
}

/**
 * Guide sidebar navigation component
 *
 * Displays a list of guide steps with:
 * - Active step highlighting
 * - Completion status indicators
 * - Mobile-responsive drawer
 * - Smooth scroll to top on step change
 *
 * @param props - Component props
 */
export function GuideSidebar({ steps, title, currentStepIndex, highestCompletedStep, onStepChange }: GuideSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleStepClick = (index: number) => {
    onStepChange(index);
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-black p-4 text-white shadow-lg lg:hidden"
        aria-label="Toggle navigation"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isMobileOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-72 border-r border-zinc-200
          bg-white transition-transform dark:border-zinc-800 dark:bg-zinc-950
          lg:sticky lg:translate-x-0
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 py-8">
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h2>
          </div>

          <nav className="flex-1 space-y-1">
            {steps.map((step, index) => {
              const isCurrent = currentStepIndex === index;
              const isCompleted = index <= highestCompletedStep && !isCurrent;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`
                    group flex w-full items-center gap-3 rounded-md px-3 py-2
                    text-left text-sm transition-colors
                    ${
                      isCurrent
                        ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                    }
                  `}
                >
                  <span
                    className={`
                      flex h-6 w-6 flex-shrink-0 items-center justify-center
                      rounded-full text-xs
                      ${
                        isCurrent
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : isCompleted
                          ? "bg-green-500 text-white dark:bg-green-600"
                          : "bg-zinc-200 text-zinc-600 group-hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="flex-1 truncate">{step.title}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <a
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              ← Back to all guides
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
