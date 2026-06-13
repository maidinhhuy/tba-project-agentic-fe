---
status: ready-for-dev
story_id: ST0
task_id: 37cf1ca0-0331-8117-ac48-fe28bf2c8cf1
---

# Story: Setup Tailwind + globals.css teal override + 8 status CSS token pairs (Frontend Init)

## Description

## Mục tiêu

Cấu hình Tailwind với teal design token #0D9488 và tạo 8 CSS status token pairs cho project statuses.

## Dependency: S-1.5/TASK-1 phải hoàn thành trước.

## File: tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',  // ← primary brand color
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        primary: '#0d9488',
      }
    }
  },
  plugins: [],
}
export default config
```

## File: src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: #0d9488;
    --color-primary-hover: #0f766e;
  }
}

@layer utilities {
  /* 8 Project Status tokens — background + text + border */
  .status-submitted    { @apply bg-gray-100 text-gray-700 border-gray-300; }
  .status-analyzing    { @apply bg-blue-100 text-blue-700 border-blue-300; }
  .status-in-development { @apply bg-indigo-100 text-indigo-700 border-indigo-300; }
  .status-awaiting-review { @apply bg-yellow-100 text-yellow-700 border-yellow-300; }
  .status-in-revision  { @apply bg-orange-100 text-orange-700 border-orange-300; }
  .status-finalizing   { @apply bg-teal-100 text-teal-700 border-teal-300; }
  .status-delivered    { @apply bg-green-100 text-green-700 border-green-300; }
  .status-cancelled    { @apply bg-red-100 text-red-700 border-red-300; }
}
```

## File: src/lib/cn.ts

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Verify

- npm run build → no Tailwind errors

- Status classes xuất hiện trong generated CSS

## Acceptance Criteria

Given the repository root, When npm run dev starts, Then http://localhost:3000 returns HTTP 200.

Given the design system setup, When the app loads, Then Tailwind CSS globals.css overrides shadcn --primary with #0D9488 (teal) and defines 8 status semantic CSS custom properties: --status-submitted-bg, --status-submitted-text, ... (one pair per state per DESIGN.md).

And shadcn/ui is installed; components/ui/ contains at minimum: Button, Card, Input, Textarea, Select, Badge, Skeleton, Toast.

And TypeScript configured: strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true.

And lib/api.ts (marked "use server" + import "server-only") exports apiFetch(path, options) that reads tba_access_token cookie from next/headers and forwards Authorization: Bearer <token> to process.env.SPRING_BOOT_URL.

And app/layout.tsx renders a top navigation shell with logo placeholder, nav link placeholders, and user avatar placeholder.

And app/page.tsx renders Customer Dashboard placeholder (authenticated route).

And app/admin/page.tsx renders Admin Dashboard placeholder (authenticated admin route).

And app/login/page.tsx renders Login page placeholder (public route).

And middleware.ts checks tba_access_token cookie: missing cookie on protected route (/, /projects/**, /admin/**) → redirect /login.

And .env.local (gitignored) template: SPRING_BOOT_URL=http://localhost:8080.

And next.config.ts sets output: 'standalone' for Railway deployment.

And Makefile includes test target: npm test. Agent chạy test bằng make test.

## Files to Create or Modify

- app/globals.css
- tailwind.config.ts
- components.json

## Dev Notes

- Stack: frontend
- Implement every acceptance criterion exactly as specified
- Follow existing code conventions and architecture patterns
- Write tests for all new functionality
- Full test suite must pass before marking complete

## Dev Agent Record

### Status
in-progress

### File List

### Change Log

