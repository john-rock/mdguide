/**
 * Application-wide constants
 *
 * This file contains constants used throughout the application to avoid
 * magic strings and make configuration easier to maintain.
 */

/**
 * LocalStorage keys used by the application
 */
export const STORAGE_KEYS = {
  /** Key for storing user's theme preference (light/dark) */
  THEME: 'mdguide-theme',

  /** Key for storing user's guide progress */
  GUIDE_PROGRESS: 'mdguide-guide-progress',
} as const;

/**
 * Theme values
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = typeof THEMES[keyof typeof THEMES];
