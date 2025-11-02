"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, THEMES, type Theme } from "@/app/lib/constants";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component that manages light/dark theme state
 *
 * Provides theme context to all child components and handles:
 * - Reading theme preference from localStorage
 * - Falling back to system preference if no saved theme
 * - Persisting theme changes to localStorage
 * - Applying theme to document root for CSS variables
 *
 * @param children - React children to wrap with theme context
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(THEMES.LIGHT);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first, then fall back to system preference
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === THEMES.DARK);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = prefersDark ? THEMES.DARK : THEMES.LIGHT;
      setTheme(initialTheme);
      document.documentElement.classList.toggle("dark", initialTheme === THEMES.DARK);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    document.documentElement.classList.toggle("dark", newTheme === THEMES.DARK);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 *
 * Provides access to current theme and toggle function.
 * Must be used within a ThemeProvider.
 *
 * @returns Theme context with current theme and toggleTheme function
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
