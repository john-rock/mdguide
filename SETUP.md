# mdguide Setup Guide

Welcome to mdguide! This guide will help you set up and customize your own documentation site using mdguide as a template.

## Table of Contents

- [Quick Start](#quick-start)
- [Manual Setup](#manual-setup)
- [Configuration Reference](#configuration-reference)
- [Creating Your First Guide](#creating-your-first-guide)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Quick Start

The fastest way to get started is using the interactive setup script:

### 1. Use This Template

Click the "Use this template" button on GitHub to create your own repository, or clone directly:

```bash
# Using GitHub's template feature (recommended)
# Click "Use this template" button on GitHub

# Or clone directly
git clone https://github.com/john-rock/mdguide.git my-docs
cd my-docs
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Setup Script

```bash
npm run setup
```

The setup wizard will prompt you for:
- **Site name** - Your documentation site's title (e.g., "My Documentation")
- **Site description** - Brief description for SEO and metadata
- **Guide index title** - Homepage main heading (default: "Guides")
- **Guide index description** - Homepage subheader text
- **Package name** - npm package name for your project (e.g., "my-docs")
- **Delete example guides** - Remove the example guides that come with mdguide
- **Create starter guide** - Generate a "Getting Started" guide template
- **Reinitialize git** - Start with a clean git history

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your site!

## Manual Setup

If you prefer to configure everything manually, follow these steps:

### 1. Update Site Configuration

Edit `app/config/site.ts`:

```typescript
export const siteConfig: SiteConfig = {
  name: 'Your Site Name',
  description: 'Your site description',
  guideIndex: {
    title: 'Your Homepage Heading',
    description: 'Your homepage subheader text',
  },
};
```

### 2. Update Package Information

Edit `package.json`:

```json
{
  "name": "your-package-name",
  "version": "0.1.0",
  "private": true,
  ...
}
```

### 3. Update localStorage Key

To avoid conflicts with other mdguide instances, update the storage key in `app/hooks/useGuideProgress.ts`:

```typescript
const STORAGE_KEY = "your-project-name-guide-progress";
```

### 4. Clean Up Example Content

Delete the example guides:

```bash
rm -rf app/guides/setup-site-name
rm -rf app/guides/creating-guides
```

### 5. Update README

Customize `README.md` with your project's information.

### 6. Reinitialize Git (Optional)

Start with a clean git history:

```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit from mdguide template"
```

## Configuration Reference

### Site Config (`app/config/site.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Site name - appears in browser tabs, page titles, and metadata |
| `description` | string | Site description - used for SEO and social media previews |
| `guideIndex.title` | string | Main heading displayed on the homepage/guide index |
| `guideIndex.description` | string | Subheader text on the homepage/guide index |

### Guide Frontmatter

Each guide's `page.mdx` file includes YAML frontmatter:

```yaml
---
title: Guide Title              # Required - The guide's main heading
description: Brief description  # Required - Shows in listings and search
published: true                 # Required - Must be true to appear
author: Author Name            # Optional - Attribution
date: YYYY-MM-DD               # Optional - Publication date
tags: [tag1, tag2]             # Optional - For filtering
isExample: true                # Optional - Marks content as example
---
```

## Creating Your First Guide

### 1. Create Guide Directory

```bash
mkdir -p app/guides/my-first-guide
```

### 2. Create page.mdx File

Create `app/guides/my-first-guide/page.mdx`:

```mdx
---
title: My First Guide
description: A simple guide to get started
published: true
---

Welcome to my first guide!

## Step 1: Introduction

This is the first step of your guide.

## Step 2: Next Steps

This is the second step.

## Step 3: Conclusion

You've completed your first guide!
```

### 3. View Your Guide

Start the dev server and navigate to `http://localhost:3000/my-first-guide`

### 4. Build for Production

When ready to deploy:

```bash
npm run build
npm run start
```

## Project Structure

```
mdguide/
├── app/
│   ├── [slug]/              # Dynamic route for guides
│   │   └── page.tsx         # Guide page renderer
│   ├── api/
│   │   └── guides/          # Search API endpoint
│   ├── components/          # React components
│   │   ├── GuideContent.tsx
│   │   ├── GuideSidebar.tsx
│   │   ├── SearchBar.tsx
│   │   └── ...
│   ├── config/
│   │   └── site.ts          # Site configuration
│   ├── guides/              # Your guide content
│   │   └── [guide-name]/
│   │       └── page.mdx
│   ├── hooks/               # React hooks
│   ├── lib/                 # Utility functions
│   │   └── guides/          # Guide processing logic
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── scripts/
│   └── setup.js             # Interactive setup script
├── SETUP.md                 # This file
├── CLAUDE.md                # Development instructions
└── package.json
```

## Development Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run setup            # Run interactive setup wizard
```

## Troubleshooting

### Guide Not Appearing

**Problem:** Your guide doesn't show up on the site.

**Solutions:**
- Verify `published: true` in frontmatter
- Ensure file is named `page.mdx` (not `guide.mdx` or anything else)
- Check that the directory is under `app/guides/`
- Run `npm run build` to regenerate static paths
- Check browser console for errors

### Steps Not Showing in Sidebar

**Problem:** Your guide steps aren't appearing in the navigation.

**Solutions:**
- Only `##` (level 2) headings become steps
- Ensure there's a space after `##`
- Check heading syntax: `## Step Name` (not `##Step Name`)
- Level 1 (`#`) and level 3 (`###`) headings don't create steps

### Search Not Working

**Problem:** Search returns no results.

**Solutions:**
- The search index builds on first API request
- Check browser console for errors
- Ensure guides have `published: true`
- Verify content is present in guide files
- Try refreshing the page

### Build Errors

**Problem:** Build fails with errors.

**Common causes:**
- Missing required frontmatter fields (`title`, `description`, `published`)
- Invalid YAML syntax in frontmatter
- Unclosed code blocks (missing closing ` ``` `)
- Invalid MDX syntax
- TypeScript type errors

**Solution:**
Check the error message carefully - it usually points to the problematic file and line number.

### Port Already in Use

**Problem:** Dev server won't start because port 3000 is in use.

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the process using port 3000
lsof -ti:3000 | xargs kill
```

### Changes Not Reflecting

**Problem:** Your changes don't appear in the browser.

**Solutions:**
- Hard refresh the page (Cmd/Ctrl + Shift + R)
- Clear browser cache
- Restart the dev server
- Check for console errors
- Ensure file was saved

## Customization Tips

### Styling

mdguide uses Tailwind CSS 4. Customize styles by:
- Editing component files in `app/components/`
- Modifying Tailwind configuration
- Adding custom CSS classes

### Adding Features

Common customizations:
- Add new metadata fields to `app/types/guide.ts`
- Customize the guide parser in `app/lib/guides/parser.ts`
- Modify search behavior in `app/lib/guides/search.ts`
- Update component styling and layout

### Theme Customization

To change colors, fonts, or spacing:
1. Review Tailwind CSS 4 documentation
2. Modify classes in component files
3. Consider creating a theme configuration

## Next Steps

Now that your site is set up:

1. **Create content** - Add guides in `app/guides/`
2. **Customize styling** - Modify components to match your brand
3. **Deploy** - Deploy to Vercel, Netlify, or your preferred hosting
4. **Add features** - Extend mdguide with your own functionality

### Deployment

mdguide is a Next.js application and can be deployed to:

- **Vercel** (recommended) - Zero-config deployment for Next.js
- **Netlify** - Supports Next.js with build plugins
- **Self-hosted** - Use `npm run build && npm run start`
- **Docker** - Create a container with your built application

### Learn More

- Review the example guides (if you kept them) for content inspiration
- Check [CLAUDE.md](CLAUDE.md) for detailed system architecture
- Explore the codebase to understand how everything works
- Join the community (if available) for support and ideas

## Getting Help

If you encounter issues:

1. Check this SETUP.md file
2. Review [CLAUDE.md](CLAUDE.md) for architecture details
3. Search existing GitHub issues
4. Create a new issue with:
   - What you're trying to do
   - What's happening instead
   - Steps to reproduce
   - Error messages (if any)

---

**Welcome to mdguide!** We hope this template helps you create amazing documentation. Happy writing!
