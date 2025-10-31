"use client";

import { useState, useEffect } from "react";

interface GuideProgress {
  [guideSlug: string]: number; // Maps guide slug to current step index
}

const STORAGE_KEY = "writerx-guide-progress";

export function useGuideProgress(guideSlug: string, totalSteps: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    setMounted(true);

    // First, check URL hash
    const hash = window.location.hash.slice(1);
    if (hash && hash.startsWith("step-")) {
      const stepNumber = parseInt(hash.replace("step-", ""), 10);
      if (!isNaN(stepNumber) && stepNumber >= 1 && stepNumber <= totalSteps) {
        setCurrentStepIndex(stepNumber - 1);
        return;
      }
    }

    // If no valid hash, check localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress: GuideProgress = JSON.parse(stored);
        const savedStep = progress[guideSlug];
        if (typeof savedStep === "number" && savedStep >= 0 && savedStep < totalSteps) {
          setCurrentStepIndex(savedStep);
        }
      }
    } catch (error) {
      console.error("Failed to load guide progress:", error);
    }
  }, [guideSlug, totalSteps]);

  // Save progress to localStorage and update URL hash whenever step changes
  useEffect(() => {
    if (mounted) {
      // Update URL hash
      window.history.replaceState(null, "", `#step-${currentStepIndex + 1}`);

      // Save to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const progress: GuideProgress = stored ? JSON.parse(stored) : {};
        progress[guideSlug] = currentStepIndex;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save guide progress:", error);
      }
    }
  }, [currentStepIndex, guideSlug, mounted]);

  return {
    currentStepIndex,
    setCurrentStepIndex,
    mounted,
  };
}
