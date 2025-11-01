"use client";

import { DarkModeToggle } from "./DarkModeToggle";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Built with mdguide
          </p>
          <DarkModeToggle />
        </div>
      </div>
    </footer>
  );
}
