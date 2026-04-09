# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Note: Production mode (build + start) is recommended over dev mode for performance
```

## Architecture

### Framework Stack
- **Next.js 16** with App Router, Turbopack
- **React 19** with TypeScript
- **Tailwind CSS v4** (CSS-first config via `@theme` in globals.css)

### Content System
- MDX posts stored in `content/posts/` with frontmatter (gray-matter)
- `lib/posts.ts` provides `getAllPosts()`, `getPostBySlug()`, `getPostsByTag()`, `getAllTags()`
- Posts filtered by `draft: true` frontmatter in production
- `reading-time` calculates estimated read time

### Design Tokens
Defined as CSS custom properties in `app/globals.css`:
- Colors: `--color-background`, `--color-surface`, `--color-text`, `--color-accent`, etc.
- Typography: `--text-xs` through `--text-4xl` using `clamp()` for fluid scaling
- Spacing: `--space-*` and `--space-section` (fluid section padding)
- Animation: `--duration-fast` (150ms), `--duration-normal` (300ms), `--ease-out-expo`

### Theming
Custom `ThemeProvider` in `components/ThemeProvider.tsx` manages dark/light mode via CSS class on `<html>`. Do NOT use `next-themes` (incompatible with React 19).

### Key Pages
| Route | File |
|-------|------|
| `/` | `app/page.tsx` (homepage) |
| `/blog` | `app/blog/page.tsx` |
| `/[slug]` | `app/[slug]/page.tsx` (post detail) |
| `/tag/[tag]` | `app/tag/[tag]/page.tsx` |
| `/search` | `app/search/page.tsx` |
| `/login` | `app/login/page.tsx` |
| `/rss.xml` | `app/rss.xml/route.ts` |
| `/sitemap.xml` | `app/sitemap.ts` |

### Navigation
Use Next.js `Link` for navigation:
```tsx
import Link from "next/link"
<Link href="/blog">Blog</Link>
```

### Post Frontmatter Schema
```yaml
---
title: "Post Title"
date: "2026-01-01"
description: "Post description"
tags: ["tag1", "tag2"]
image: "/optional-og-image.jpg"
draft: false
---
```
