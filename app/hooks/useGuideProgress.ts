"use client";

import { useState, useEffect } from "react";

interface GuideProgress {
  [guideSlug: string]: {
    currentStep: number;
    highestCompletedStep: number;
  };
}

const STORAGE_KEY = "mdguide-guide-progress";

export function useGuideProgress(guideSlug: string, totalSteps: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highestCompletedStep, setHighestCompletedStep] = useState(-1);
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
        // Don't return yet, still need to load highestCompletedStep from storage
      }
    }

    // Load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const progress: GuideProgress = JSON.parse(stored);
        const savedProgress = progress[guideSlug];

        // Handle both old format (number) and new format (object)
        if (savedProgress) {
          if (typeof savedProgress === "number") {
            // Old format - migrate to new format
            if (!hash || !hash.startsWith("step-")) {
              setCurrentStepIndex(savedProgress);
            }
            setHighestCompletedStep(savedProgress - 1);
          } else {
            // New format
            if (!hash || !hash.startsWith("step-")) {
              if (savedProgress.currentStep >= 0 && savedProgress.currentStep < totalSteps) {
                setCurrentStepIndex(savedProgress.currentStep);
              }
            }
            setHighestCompletedStep(savedProgress.highestCompletedStep);
          }
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

      // Completed steps are all steps before the current step
      // When moving forward or backward, this updates accordingly
      const newHighestCompleted = currentStepIndex - 1;
      setHighestCompletedStep(newHighestCompleted);

      // Save to localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const progress: GuideProgress = stored ? JSON.parse(stored) : {};
        progress[guideSlug] = {
          currentStep: currentStepIndex,
          highestCompletedStep: newHighestCompleted,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to save guide progress:", error);
      }
    }
  }, [currentStepIndex, guideSlug, mounted]);

  return {
    currentStepIndex,
    setCurrentStepIndex,
    highestCompletedStep,
    mounted,
  };
}
