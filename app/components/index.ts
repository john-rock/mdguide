/**
 * Component exports
 *
 * Central export file for all application components
 */

// Theme components
export { ThemeProvider, useTheme, DarkModeToggle } from "./theme";

// Layout components
export { Footer } from "./layout";

// Guide components
export {
  CmdkSearchBar,
  GuideContent,
  GuideSidebar,
  StepSection,
  TagFilter,
} from "./guides";

// Guide component prop types
export type {
  CmdkSearchBarProps,
  GuideContentProps,
  GuideSidebarProps,
  TagFilterProps,
} from "./guides";
