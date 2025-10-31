"use client";

import { useEffect, useState } from "react";
import type { Step } from "@/app/types/guide";

interface GuideSidebarProps {
  steps: Step[];
  title: string;
}

export function GuideSidebar({ steps, title }: GuideSidebarProps) {
  const [activeStepId, setActiveStepId] = useState<string>("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Set initial active step from URL hash or first step
    const hash = window.location.hash.slice(1);
    if (hash && steps.some((step) => step.id === hash)) {
      setActiveStepId(hash);
    } else if (steps.length > 0) {
      setActiveStepId(steps[0].id);
    }

    // Intersection Observer for scroll spy
    const observerOptions = {
      rootMargin: "-80px 0px -80% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveStepId(id);
          // Update URL hash without scrolling
          window.history.replaceState(null, "", `#${id}`);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all step sections
    steps.forEach((step) => {
      const element = document.getElementById(step.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [steps]);

  const handleStepClick = (stepId: string) => {
    const element = document.getElementById(stepId);
    if (element) {
      // Smooth scroll to the step
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Update URL hash
      window.history.pushState(null, "", `#${stepId}`);
      setActiveStepId(stepId);
      setIsMobileOpen(false);
    }
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

          <nav className="space-y-1">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                className={`
                  group flex w-full items-center gap-3 rounded-md px-3 py-2
                  text-left text-sm transition-colors
                  ${
                    activeStepId === step.id
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
                      activeStepId === step.id
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-zinc-200 text-zinc-600 group-hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-400"
                    }
                  `}
                >
                  {index + 1}
                </span>
                <span className="flex-1 truncate">{step.title}</span>
              </button>
            ))}
          </nav>
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
