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

mdguide is a Next.js 16 application that provides a modern documentation/guide platform with step-by-step guides, full-text search, and progress tracking. It uses the App Router architecture with React 19 and Tailwind CSS 4.

## Site Configuration

The site is configured via `app/config/site.ts`, which exports a `siteConfig` object:

```typescript
export const siteConfig: SiteConfig = {
  metadata: {
    title: 'mdguide',                 // Site title (browser tab, SEO metadata)
    description: 'Site description...' // Site description (SEO metadata)
  },
  homepage: {
    title: 'Guides',                  // Main heading on homepage
    description: 'Step-by-step...',   // Subheader on homepage
  },
  llmsTxt: {
    enabled: true,                    // Enable/disable llms.txt generation
    includeStepContent: true,         // Include full step content in llms.txt
  },
};
```

**Customization**: To customize your site's branding and homepage:
1. Edit `app/config/site.ts`
2. Update `metadata.title` and `metadata.description` to change SEO metadata and browser tab title
3. Update `homepage.title` to change the main heading on the homepage
4. Update `homepage.description` to change the subheader text

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

### Open Graph Images

mdguide automatically generates dynamic Open Graph images for social media sharing:

**Implementation**:
- `app/opengraph-image.tsx` - Generates OG image for homepage
- `app/[slug]/opengraph-image.tsx` - Generates OG images for each guide
- Next.js automatically includes these images in page metadata
- Images are statically generated at build time

**Image Features**:
- Homepage: Shows site title (96px) and description centered
- Guide pages: Shows guide title (72px), site name, author, and step count
- Uses gradient background (slate to dark: #1e293b to #0f172a)
- Size: 1200x630px (optimized for social platforms)

**Configuration** (`app/config/site.ts`):
```typescript
openGraph: {
  // Leave undefined to use auto-generated OG image
  // Or set to a custom image path like '/og-image.png'
  homepageImage: undefined,
}
```

**Using Custom Images**:
1. Place your custom OG image in the `public/` directory (e.g., `public/og-image.png`)
2. Update `app/config/site.ts`:
   ```typescript
   openGraph: {
     homepageImage: '/og-image.png',
   }
   ```
3. The custom image will be used for the homepage; guide pages still use dynamic images

**Usage**:
- Homepage: Automatically applied when sharing the root URL
- Guide pages: Automatically applied when sharing guide URLs: `/{slug}`
- Social media platforms (Twitter, Facebook, LinkedIn, etc.) will automatically fetch the images
- No additional configuration needed for dynamic images

**Customization**:
- Edit `app/opengraph-image.tsx` to change homepage design
- Edit `app/[slug]/opengraph-image.tsx` to change guide page design
- Modify gradient colors, fonts, layout, spacing as needed
- Add your logo or branding elements

### Progress Tracking System

The `useGuideProgress` hook implements a dual-storage system:
1. URL hash (`#step-N`) - For shareability and bookmarking
2. localStorage (`mdguide-guide-progress`) - Persists progress across sessions

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
- The page title and description are controlled by `siteConfig.homepage` in `app/config/site.ts`

### llms.txt Generation
mdguide can automatically generate an `llms.txt` file from your guide content for LLM consumption:

**Configuration** (`app/config/site.ts`):
```typescript
llmsTxt: {
  enabled: true,              // Toggle llms.txt generation on/off
  includeStepContent: true,   // Include full step content (true) or just titles (false)
}
```

**Features**:
- Accessible at `/llms.txt` route
- Automatically includes all published guides with metadata and steps
- Footer link appears when enabled
- Follows the [llms.txt specification](https://llmstxt.org/)
- Statically generated at build time
- Includes table of contents with anchor links
- Shows total guides and last updated date

**Implementation**:
- Generator: `app/lib/guides/llmsTxtGenerator.ts`
- Route handler: `app/llms.txt/route.ts`
- Footer integration: `app/components/layout/Footer.tsx`

To disable the feature, set `llmsTxt.enabled` to `false` in `app/config/site.ts`.

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
