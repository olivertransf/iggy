# Next.js Project Structure Guide

## Common Directory Structure

```text
SIPREP/
├── app/                    # Next.js App Router (routing & pages)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (/)
│   ├── globals.css        # Global styles
│   ├── about/             # Route: /about
│   │   └── page.tsx
│   ├── blog/              # Route: /blog
│   │   ├── page.tsx       # Blog list
│   │   └── [slug]/        # Dynamic route: /blog/[slug]
│   │       └── page.tsx
│   └── api/               # API routes
│       └── users/
│           └── route.ts
│
├── components/             # Reusable React components
│   ├── ui/                # UI components (buttons, cards, etc.)
│   ├── layout/            # Layout components (header, footer, nav)
│   └── features/          # Feature-specific components
│
├── lib/                   # Utility functions & helpers
│   ├── utils.ts           # General utilities
│   ├── api.ts             # API client functions
│   └── constants.ts       # Constants
│
├── types/                 # TypeScript type definitions
│   └── index.ts
│
├── public/                # Static assets (served at root)
│   ├── images/            # Images
│   ├── icons/             # Icons
│   ├── fonts/             # Font files
│   └── favicon.ico        # Favicon
│
└── [config files]         # package.json, tsconfig.json, etc.
```

## Resource Locations

### Static Assets → `public/`

Files in `public/` are served at the root URL:

- `public/logo.png` → accessible at `/logo.png`
- `public/images/hero.jpg` → accessible at `/images/hero.jpg`

**Common subdirectories:**

- `public/images/` - Images, photos, graphics
- `public/icons/` - Icon files (SVG, PNG)
- `public/fonts/` - Custom font files
- `public/videos/` - Video files

**Usage in code:**

```tsx
// In components
<Image src="/logo.png" alt="Logo" width={100} height={100} />
<img src="/images/hero.jpg" alt="Hero" />
```

### Components → `components/`

Reusable React components organized by purpose:

- `components/ui/` - Basic UI elements (Button, Card, Input)
- `components/layout/` - Layout components (Header, Footer, Sidebar)
- `components/features/` - Feature-specific components

**Example:**

```tsx
// components/ui/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// Usage in app/page.tsx
import { Button } from "@/components/ui/Button";
```

### Utilities → `lib/`

Helper functions, API clients, and shared logic:

- `lib/utils.ts` - General utility functions
- `lib/api.ts` - API request functions
- `lib/constants.ts` - App-wide constants

**Example:**

```tsx
// lib/utils.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

// Usage
import { formatDate } from "@/lib/utils";
```

### Types → `types/`

TypeScript type definitions:

```tsx
// types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
}
```

## App Router Structure

### Routes

- `app/page.tsx` → `/` (home page)
- `app/about/page.tsx` → `/about`
- `app/blog/page.tsx` → `/blog`
- `app/blog/[slug]/page.tsx` → `/blog/my-post` (dynamic)

### Layouts

- `app/layout.tsx` - Root layout (wraps all pages)
- `app/dashboard/layout.tsx` - Layout for `/dashboard/*` routes

### Special Files

- `loading.tsx` - Loading UI
- `error.tsx` - Error UI
- `not-found.tsx` - 404 page
- `route.ts` - API route handlers

## Best Practices

1. **Keep components small and focused** - One component per file
2. **Use TypeScript** - Define types in `types/` directory
3. **Organize by feature** - Group related components together
4. **Use path aliases** - `@/components`, `@/lib`, etc. (configured in tsconfig.json)
5. **Static assets** - Always use `public/` for images, fonts, etc.
6. **API routes** - Place in `app/api/` directory

## Example Component Structure

```text
components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
└── features/
    └── blog/
        ├── BlogCard.tsx
        └── BlogList.tsx
```
