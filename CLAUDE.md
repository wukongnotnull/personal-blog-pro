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

### Internationalization
- **next-intl** for i18n with two locales: `en` (default), `zh`
- `routing.ts` defines locales and exports `Link`, `redirect`, `useRouter`, `usePathname` from `createNavigation`
- `middleware.ts` handles locale routing via `next-intl/middleware`
- All locale-aware pages are under `app/[locale]/`
- Use the intl `Link` component for locale-aware navigation

### Content System
- MDX posts stored in `content/posts/` with frontmatter (gray-matter)
- `lib/posts.ts` provides `getAllPosts()`, `getPostBySlug()`, `getPostsByTag()`, `getAllTags()`
- Posts filtered by `draft: true` frontmatter in production
- `reading-time` calculates estimated read time
- `flexsearch` provides full-text search via `app/[locale]/search/SearchContent.tsx`

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
| `/` or `/en` | `app/[locale]/page.tsx` (homepage) |
| `/en/blog`, `/zh/blog` | `app/[locale]/blog/page.tsx` |
| `/en/[slug]` | `app/[locale]/[slug]/page.tsx` (post detail) |
| `/en/tag/[tag]` | `app/[locale]/tag/[tag]/page.tsx` |
| `/en/search` | `app/[locale]/search/page.tsx` |
| `/rss.xml` | `app/rss.xml/route.ts` |
| `/sitemap.xml` | `app/sitemap.ts` |

### Navigation
Use `@/routing` Link for locale-aware links:
```tsx
import { Link } from "@/routing"
<Link href="/blog" locale={locale}>Blog</Link>
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

### Link Component Pattern
When adding locale-aware links, pass `locale` prop and use `locale={false}` only when intentionally bypassing locale prefix:
```tsx
// WRONG - loses locale
<Link href={`/${tag}`}>

// CORRECT - preserves locale
<Link href={`/${locale}/tag/${tag}`} locale={locale}>
```

### Translations
- Add keys to `messages/en.json` and `messages/zh.json`
- Use `getTranslations()` in server components
- Use `useTranslations()` in client components
