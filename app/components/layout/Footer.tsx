"use client";

import { DarkModeToggle } from "../theme/DarkModeToggle";
import { siteConfig } from "@/app/config/site";

export function Footer() {
  const showLlmsTxt = siteConfig.llmsTxt?.enabled ?? false;

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {siteConfig.footer.text}
            </p>
            {showLlmsTxt && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <a
                  href="/llms.txt"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  llms.txt
                </a>
              </>
            )}
          </div>
          <DarkModeToggle />
        </div>
      </div>
    </footer>
  );
}
