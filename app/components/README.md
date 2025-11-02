# Components

This directory contains all React components for the mdguide application, organized by functionality.

## Directory Structure

```
components/
├── theme/          # Theme management components
├── layout/         # Page layout components
├── guides/         # Guide-specific components
└── index.ts        # Central export file
```

## Component Organization

### Theme Components (`theme/`)

**ThemeProvider** - Context provider for theme state management
- Manages light/dark theme with localStorage persistence
- Falls back to system preference if no saved theme
- Must wrap your app at the root level

**DarkModeToggle** - Button to toggle between light and dark themes
- Displays current theme and icon
- Accessible with aria-label

**Usage:**
```tsx
import { ThemeProvider, useTheme, DarkModeToggle } from '@/app/components/theme';

// In your root layout
<ThemeProvider>
  <YourApp />
</ThemeProvider>

// In any child component
function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  return <DarkModeToggle />;
}
```

### Layout Components (`layout/`)

**Footer** - Site footer with configurable text and dark mode toggle
- Reads footer text from `siteConfig.footer.text`
- Includes DarkModeToggle component

**Usage:**
```tsx
import { Footer } from '@/app/components/layout';

<Footer />
```

### Guide Components (`guides/`)

**GuideContent** - Main container for rendering a complete guide
- Manages step navigation and progress tracking
- Integrates sidebar, search, and step rendering
- Persists progress to localStorage and URL hash

**Props:**
- `guide: Guide` - The complete guide data to render

**GuideSidebar** - Navigation sidebar showing all steps
- Highlights active step
- Shows completion status for each step
- Mobile-responsive with drawer on small screens

**Props:**
- `steps: Step[]` - Array of guide steps
- `title: string` - Guide title
- `currentStepIndex: number` - Currently active step index
- `highestCompletedStep: number` - Highest completed step index
- `onStepChange: (index: number) => void` - Step selection callback

**StepSection** - Renders individual step content
- Uses react-markdown for markdown rendering
- Supports GitHub Flavored Markdown
- Syntax highlighting for code blocks

**CmdkSearchBar** - Command palette search interface
- Keyboard shortcut: Cmd/Ctrl+K
- Full-text search across guides and steps
- Tag-based filtering
- Navigation to guides and specific steps

**Props:**
- `onSearch: (query: string) => Promise<SearchResult[]>` - Search function
- `showBackToHome?: boolean` - Show "Back to Home" option
- `currentGuideSlug?: string` - Current guide slug (optional)
- `currentGuideTitle?: string` - Current guide title (optional)
- `onStepSelect?: (stepIndex: number) => void` - Step selection callback (optional)

**TagFilter** - Collapsible tag filter for homepage
- Displays all available tags
- Allows multiple tag selection
- Shows selected tag count badge
- Provides "Clear filters" button

**Props:**
- `tags: string[]` - All available tags
- `selectedTags: string[]` - Currently selected tags
- `onTagsChange: (tags: string[]) => void` - Tag selection callback

## Import Patterns

### Using Index Files (Recommended)

```tsx
// Import from subdirectory index
import { ThemeProvider, useTheme } from '@/app/components/theme';
import { Footer } from '@/app/components/layout';
import { GuideContent, GuideSidebar } from '@/app/components/guides';

// Import from root index (all components)
import { ThemeProvider, Footer, GuideContent } from '@/app/components';

// Import types
import type { GuideContentProps, GuideSidebarProps } from '@/app/components';
```

### Direct Imports

```tsx
// Direct file imports (if needed)
import { ThemeProvider } from '@/app/components/theme/ThemeProvider';
import { Footer } from '@/app/components/layout/Footer';
```

## Component Props Types

All component prop interfaces are exported for reusability:

```tsx
import type {
  CmdkSearchBarProps,
  GuideContentProps,
  GuideSidebarProps,
  TagFilterProps,
} from '@/app/components';

// Use in your own components
function MyWrapper(props: GuideContentProps) {
  return <GuideContent {...props} />;
}
```

## Styling

All components use Tailwind CSS with dark mode support via the `dark:` prefix. The theme is managed by the ThemeProvider which applies the `dark` class to the document root.

## Accessibility

- All interactive components have proper ARIA labels
- Keyboard navigation is supported throughout
- Focus states are clearly visible
- Semantic HTML is used where appropriate

## Common Patterns

### Progress Tracking

Guide progress is tracked using the `useGuideProgress` hook (in `app/hooks/`):
- Saves to localStorage as `mdguide-guide-progress`
- Syncs with URL hash (`#step-N`)
- URL hash takes precedence over localStorage

### Theme Persistence

Theme preference is saved to localStorage as `mdguide-theme`:
- Falls back to system preference if not set
- Applies theme on mount to prevent flash
- Updates document root class for CSS variables

### Search Implementation

Search uses FlexSearch for client-side full-text search:
- Index is built once and cached in memory
- Searches guide titles, descriptions, and step content
- Returns both guide-level and step-level matches

## Adding New Components

When adding new components:

1. **Choose the right directory** based on functionality
   - `theme/` - Theme-related components
   - `layout/` - Page structure components (header, footer, nav)
   - `guides/` - Guide-specific functionality
   - Root level - If none of the above fit

2. **Add JSDoc comments** explaining the component's purpose and props

3. **Export prop interfaces** for reusability
   ```tsx
   export interface MyComponentProps {
     // ...
   }

   export function MyComponent(props: MyComponentProps) {
     // ...
   }
   ```

4. **Update index files** to export the component
   ```tsx
   // In subdirectory index.ts
   export { MyComponent } from './MyComponent';
   export type { MyComponentProps } from './MyComponent';
   ```

5. **Update root index.ts** if the component should be available from the root export

6. **Follow existing patterns** for consistency:
   - Use "use client" directive for client components
   - Use Tailwind CSS for styling
   - Support dark mode with `dark:` classes
   - Add proper TypeScript types

## Testing

When making changes to components:

1. Run the development server: `npm run dev`
2. Test in both light and dark modes
3. Test responsive behavior on different screen sizes
4. Verify localStorage persistence works correctly
5. Run the build: `npm run build` to check for type errors

## Related Documentation

- [CLAUDE.md](../../CLAUDE.md) - Full project documentation
- [app/types/guide.ts](../types/guide.ts) - Type definitions for guides
- [app/config/site.ts](../config/site.ts) - Site configuration
- [app/lib/constants.ts](../lib/constants.ts) - Application constants
