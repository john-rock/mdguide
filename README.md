# WriterX

A modern, interactive documentation and guide platform built with Next.js. WriterX helps you create beautiful, searchable, step-by-step guides with progress tracking and an intuitive user experience.

## Features

- **Step-by-Step Guides** - Break down complex topics into manageable, trackable steps
- **Full-Text Search** - Fast, client-side search powered by FlexSearch
- **Progress Tracking** - Automatically track user progress through guides with local storage
- **Markdown Support** - Write guides in Markdown with GitHub Flavored Markdown support
- **Syntax Highlighting** - Beautiful code highlighting with rehype-highlight
- **Responsive Design** - Mobile-first design built with Tailwind CSS
- **Dark Mode** - Full dark mode support
- **Type-Safe** - Built with TypeScript for better developer experience

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Content**: MDX with [react-markdown](https://github.com/remarkjs/react-markdown)
- **Search**: [FlexSearch](https://github.com/nextapps-de/flexsearch)
- **Language**: TypeScript
- **Rendering**: React 19

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/john-rock/writerx.git
cd writerx
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
writerx/
├── app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   │   └── guides/    # Guide-specific components
│   ├── guides/        # Guides pages and routes
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and libraries
│   │   └── guides/    # Guide parsing, search, and loading
│   ├── types/         # TypeScript type definitions
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── public/            # Static assets
└── guides/            # Guide content (Markdown files)
```

## Creating Guides

Guides are written in Markdown format with YAML frontmatter. Here's an example:

```markdown
---
title: Getting Started
description: Learn the basics of WriterX
author: Your Name
date: 2025-10-31
tags: [beginner, tutorial]
published: true
---

# Introduction

Your guide content here...

## Step 1: First Step

Step content...

## Step 2: Second Step

More content...
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### Key Components

- **GuideContent** - Renders guide content with step navigation
- **SearchBar** - Provides search functionality across all guides
- **GuideSidebar** - Navigation sidebar with table of contents
- **StepSection** - Individual step rendering with progress tracking

## Roadmap

This project is a work in progress. Planned features include:

- [ ] User authentication and personalized dashboards
- [ ] Guide authoring interface
- [ ] Community contributions and ratings
- [ ] Export guides to PDF
- [ ] Multi-language support
- [ ] Analytics and insights

## Contributing

Contributions are welcome! This project is still in active development.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [MDX](https://mdxjs.com/) - Markdown for the component era
- [FlexSearch](https://github.com/nextapps-de/flexsearch) - Full-text search library

