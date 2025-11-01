# Guide System Documentation

## Overview

This application includes a complete guide/documentation system that allows you to create step-by-step guides using Markdown (MDX) files. Each `## heading` in your guide becomes an interactive step in a sidebar navigation.

## Architecture

### Directory Structure

```
app/
├── guides/
│   ├── (content)/              # Guide content files
│   │   ├── getting-started/
│   │   │   └── page.mdx
│   │   └── advanced-features/
│   │       └── page.mdx
│   ├── [slug]/                 # Dynamic route for individual guides
│   │   ├── page.tsx
│   │   └── layout.tsx
│   └── page.tsx                # Guides listing page
├── components/
│   └── guides/
│       ├── GuideContent.tsx    # Main guide container
│       ├── GuideSidebar.tsx    # Interactive sidebar with scroll spy
│       ├── StepSection.tsx     # Individual step renderer
│       └── SearchBar.tsx       # Search component
├── lib/
│   └── guides/
│       ├── parser.ts           # MDX parsing & step extraction
│       ├── loader.ts           # File system utilities
│       └── search.ts           # Search index & functionality
├── types/
│   └── guide.ts                # TypeScript type definitions
└── api/
    └── guides/
        └── route.ts            # API endpoint for guides list
```

## Creating a New Guide

### 1. Create Guide Directory

Create a new directory under `app/guides/(content)/`:

```bash
mkdir -p app/guides/(content)/your-guide-name
```

### 2. Create page.mdx File

Create a `page.mdx` file in your guide directory:

```markdown
---
title: Your Guide Title
description: Brief description of what this guide covers
author: Your Name
date: 2025-10-31
tags: [tag1, tag2, tag3]
published: true
---

## First Step

Content for the first step goes here. This can include:
- Lists
- Code blocks
- Links
- Images

## Second Step

Each `## heading` becomes a clickable step in the sidebar.

\`\`\`javascript
// Code blocks are automatically syntax highlighted
function example() {
  return "Hello, World!";
}
\`\`\`

## Third Step

And so on...
```

### 3. Frontmatter Fields

- `title` (required): The guide's main title
- `description` (required): Short description for SEO and listings
- `author` (optional): Author name
- `date` (optional): Publication date (YYYY-MM-DD or Date object)
- `tags` (optional): Array of tags for categorization
- `published` (optional): Boolean, defaults to true. Set to false to hide guide

## Features

### 1. Automatic Step Extraction

The system automatically extracts all `## headings` from your guide and converts them into navigable steps.

### 2. Interactive Sidebar

- **Scroll Spy**: Active step updates as you scroll
- **Smooth Scrolling**: Click any step to smoothly scroll to it
- **URL Hash Updates**: URL updates with step anchor (e.g., `#introduction`)
- **Mobile Responsive**: Sidebar converts to a drawer on mobile devices
- **Step Numbers**: Each step shows its number in the sidebar

### 3. Search Functionality

- **Full-Text Search**: Search across all guides and steps
- **Keyboard Shortcut**: Press `⌘K` (Mac) or `Ctrl+K` (Windows) to focus search
- **Instant Results**: Client-side search using FlexSearch
- **Step-Level Results**: Search results show specific steps within guides

### 4. Code Syntax Highlighting

Code blocks are automatically highlighted using `rehype-highlight`:

\`\`\`javascript
// Supported languages include: js, ts, python, bash, etc.
const example = "code";
\`\`\`

### 5. Responsive Design

- Desktop: Fixed sidebar on the left, scrollable content on the right
- Mobile: Collapsible drawer sidebar, floating toggle button
- Dark mode support throughout

### 6. SEO Optimization

- Automatic metadata generation from frontmatter
- Static site generation (SSG) for all guides
- Semantic HTML structure

## Technical Details

### Static Generation

All guides are statically generated at build time using Next.js's `generateStaticParams`. This means:

- Fast page loads
- SEO-friendly
- No server rendering overhead

### Search Index

The search index is built on first API request and cached. It includes:

- Guide titles and descriptions
- All step titles and content
- Tag metadata

### Styling

The system uses Tailwind CSS with a custom design system:

- Zinc color palette
- Dark mode support
- Responsive breakpoints
- Accessible focus states

## API

### GET /api/guides

Returns a list of all published guides with metadata:

```json
[
  {
    "slug": "getting-started",
    "metadata": {
      "title": "Getting Started",
      "description": "Learn the basics...",
      "author": "mdguide Team",
      "date": "2025-10-31",
      "tags": ["beginner", "tutorial"],
      "published": true
    }
  }
]
```

## Customization

### Adding Custom MDX Components

Edit `app/components/guides/StepSection.tsx` to customize how markdown elements are rendered:

```typescript
<ReactMarkdown
  components={{
    h1: ({ ...props }) => <h1 className="custom-class" {...props} />,
    // Add more custom components...
  }}
>
  {step.content}
</ReactMarkdown>
```

### Modifying Sidebar Appearance

Edit `app/components/guides/GuideSidebar.tsx` to customize:

- Sidebar width
- Step styling
- Mobile behavior
- Scroll spy sensitivity

### Changing Search Behavior

Edit `app/lib/guides/search.ts` to customize:

- Search algorithm
- Result ranking
- Index fields
- Result limits

## Performance Considerations

### Scalability

The system is designed to handle:

- **100+ guides**: Static generation scales well
- **50+ steps per guide**: Virtualization ready (implement if needed)
- **Large search index**: FlexSearch is optimized for performance

### Optimization Tips

1. **Images**: Use Next.js `<Image>` component for automatic optimization
2. **Code Splitting**: Each guide route is automatically code-split
3. **Search Index**: Built once per deployment, cached in memory
4. **Lazy Loading**: Consider lazy-loading heavy components

## Development

### Running Locally

```bash
npm run dev
```

Visit:
- Guides listing: http://localhost:3000/guides
- Individual guide: http://localhost:3000/guides/getting-started

### Building for Production

```bash
npm run build
npm start
```

### Adding New Dependencies

If you need to add markdown plugins:

```bash
npm install remark-plugin-name
```

Then update `StepSection.tsx`:

```typescript
import newPlugin from 'remark-plugin-name';

<ReactMarkdown remarkPlugins={[remarkGfm, newPlugin]}>
```

## Troubleshooting

### Guide Not Showing Up

1. Check that `published: true` in frontmatter
2. Ensure file is named `page.mdx`
3. Verify directory is under `app/guides/(content)/`
4. Rebuild the project: `npm run build`

### Steps Not Parsing

1. Ensure headings use `##` (level 2)
2. Check for proper markdown syntax
3. Verify no frontmatter syntax errors

### Search Not Working

1. Check that API endpoint `/api/guides` is accessible
2. Verify search index is being built
3. Check browser console for errors

## Future Enhancements

Potential improvements you could add:

- [ ] Version control for guides
- [ ] Comments/feedback system
- [ ] Print-friendly styling
- [ ] PDF export
- [ ] Multi-language support
- [ ] Progress tracking
- [ ] Estimated reading time
- [ ] Interactive code playgrounds
- [ ] Video embedding support
- [ ] Related guides suggestions
