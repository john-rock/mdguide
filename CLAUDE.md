# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

## Project Overview

WriterX is a Next.js 16 application that provides a modern documentation/guide platform with step-by-step guides, full-text search, and progress tracking. It uses the App Router architecture with React 19 and Tailwind CSS 4.

## Site Configuration

The site is configured via `app/config/site.ts`, which exports a `siteConfig` object:

```typescript
export const siteConfig: SiteConfig = {
  name: 'WriterX',                    // Site name (used in metadata)
  description: 'Site description...',  // Site description (used in metadata)
  guideIndex: {
    title: 'Guides',                   // Main heading on guide index/homepage
    description: 'Step-by-step...',    // Subheader on guide index/homepage
  },
};
```

**Customization**: To customize your site's branding and guide index page:
1. Edit `app/config/site.ts`
2. Update the `name` field to change the site title (appears in browser tab/metadata)
3. Update `guideIndex.title` to change the main heading on the homepage
4. Update `guideIndex.description` to change the subheader text

**Type definitions**: Located in `app/types/site.ts`

## Core Architecture

### Guide System Architecture

The guide system is the heart of this application. Here's how it works:

1. **Content Storage**: Guides live in `app/guides/[guide-name]/page.mdx`
   - Each guide is a directory with a `page.mdx` file
   - MDX files have YAML frontmatter with metadata
   - Each `## heading` in the MDX becomes a navigable "step"

2. **Content Processing Pipeline**:
   - `app/lib/guides/loader.ts` - Reads MDX files from filesystem
   - `app/lib/guides/parser.ts` - Parses frontmatter with gray-matter and extracts steps from `##` headings
   - `app/lib/guides/search.ts` - Builds FlexSearch index for full-text search

3. **Static Generation Flow**:
   - All guides are statically generated at build time
   - `getAllGuideSlugs()` provides paths for `generateStaticParams`
   - Individual guide pages load via `getGuideBySlug(slug)`
   - Search API endpoint (`/api/guides`) builds index on first request

4. **Client-Side Features**:
   - `useGuideProgress` hook tracks progress in localStorage
   - URL hash format: `#step-N` where N is 1-indexed step number
   - GuideSidebar implements scroll spy to highlight active step
   - SearchBar provides client-side search with keyboard shortcuts (Cmd/Ctrl+K)

### Key Type Definitions

Located in `app/types/guide.ts`:
- `GuideMetadata` - Frontmatter data (title, description, author, date, tags, published)
- `Step` - Individual step (id, title, content, level)
- `Guide` - Complete guide (slug, metadata, steps, rawContent)
- `SearchResult` - Search result format

### Component Architecture

**Guide Rendering Flow**:
1. `app/[slug]/page.tsx` - Route handler, loads guide data
2. `GuideContent.tsx` - Main container, manages step state
3. `GuideSidebar.tsx` - Navigation sidebar with scroll spy
4. `StepSection.tsx` - Renders individual step content with react-markdown

**Search Flow**:
1. `SearchBar.tsx` - Search UI component
2. Fetches from `/api/guides` route
3. Uses FlexSearch to search guide titles, descriptions, and step content
4. Returns results with both guide-level and step-level matches

### Progress Tracking System

The `useGuideProgress` hook implements a dual-storage system:
1. URL hash (`#step-N`) - For shareability and bookmarking
2. localStorage (`writerx-guide-progress`) - Persists progress across sessions

Priority: URL hash takes precedence over localStorage on page load.

## Creating New Guides

1. Create directory: `app/guides/[slug-name]/`
2. Create file: `page.mdx` with frontmatter:
   ```yaml
   ---
   title: Guide Title
   description: Brief description
   author: Author Name (optional)
   date: YYYY-MM-DD (optional)
   tags: [tag1, tag2] (optional)
   published: true
   ---
   ```
3. Write content using `## Step Name` for each step
4. Run `npm run build` to regenerate static paths

## Important Implementation Details

### Step Extraction Logic
- Only `##` (level 2) headings become steps
- Step IDs are slugified from heading text (see `slugify()` in parser.ts)
- Content between headings is captured as step content
- Steps are numbered starting from 1 in the UI, but 0-indexed internally

### Search Index
- Built once per deployment and cached in memory
- Indexes: guide titles, descriptions, step titles, and step content
- Uses FlexSearch Document index with "forward" tokenization
- Results are deduplicated by `slug-stepId` combination

### Markdown Rendering
- Uses react-markdown with remark-gfm for GitHub Flavored Markdown
- Code highlighting via rehype-highlight
- Custom component mapping available in StepSection.tsx

### Route Structure
- Guide content files are stored in `app/guides/[guide-name]/page.mdx`
- Individual guides are accessible at `/{slug}` (e.g., `/getting-started`)
- The dynamic route handler is located at `app/[slug]/page.tsx`

### Homepage Configuration
- The homepage (`app/page.tsx`) displays the guide index
- The guide index shows all published guides with search and tag filtering
- The page title and description are controlled by `siteConfig.guideIndex` in `app/config/site.ts`

## Tech Stack Notes

- **Next.js 16**: Uses App Router, Server Components by default
- **React 19**: New JSX transform, upgraded hooks
- **Tailwind CSS 4**: Uses new @tailwindcss/postcss plugin
- **TypeScript 5**: Strict mode enabled
- **FlexSearch**: Client-side full-text search library
- **gray-matter**: YAML frontmatter parser
- **react-markdown**: Markdown to React renderer

## Common Pitfalls

1. **Guide not appearing**: Check `published: true` in frontmatter, ensure file is named `page.mdx`
2. **Steps not parsing**: Only `##` headings work, not `#` or `###`
3. **Search not working**: API route must build index on first request, check console for errors
4. **Build errors**: Run `npm run build` after adding new guides to regenerate static params
