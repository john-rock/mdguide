"use client";

import { GuideSidebar } from "./GuideSidebar";
import { StepSection } from "./StepSection";
import { useGuideProgress } from "@/app/hooks/useGuideProgress";
import type { Guide } from "@/app/types/guide";

interface GuideContentProps {
  guide: Guide;
}

export function GuideContent({ guide }: GuideContentProps) {
  const { currentStepIndex, setCurrentStepIndex, mounted } = useGuideProgress(
    guide.slug,
    guide.steps.length
  );

  const currentStep = guide.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === guide.steps.length - 1;

  // Don't render until mounted to prevent flash
  if (!mounted) {
    return null;
  }

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* Sidebar */}
      <GuideSidebar
        steps={guide.steps}
        title={guide.metadata.title}
        currentStepIndex={currentStepIndex}
        onStepChange={setCurrentStepIndex}
      />

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-6 py-12 sm:px-8 lg:px-12">
          {/* Guide header - only show on first step */}
          {isFirstStep && (
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
          )}

          {/* Current step */}
          <div className="min-h-[60vh]">
            <StepSection step={currentStep} />
          </div>

          {/* Step navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <button
              onClick={goToPreviousStep}
              disabled={isFirstStep}
              className={`
                flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
                ${
                  isFirstStep
                    ? "cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }
              `}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="text-sm text-zinc-500 dark:text-zinc-500">
              Step {currentStepIndex + 1} of {guide.steps.length}
            </div>

            <button
              onClick={goToNextStep}
              disabled={isLastStep}
              className={`
                flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors
                ${
                  isLastStep
                    ? "cursor-not-allowed text-zinc-400 dark:text-zinc-600"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }
              `}
            >
              Next
              <svg
                className="h-4 w-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Footer navigation */}
          <footer className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
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
