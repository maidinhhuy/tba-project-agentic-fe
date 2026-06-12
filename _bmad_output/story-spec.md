---
status: ready-for-dev
story_id: ST0
task_id: 37df1ca0-0331-8128-98e6-d14db2f539d9
---

# Story: Create Makefile with test/dev/build targets (Frontend Init)

## Description

## Mục tiêu

Tạo Makefile tại root của FE repository với các targets chuẩn theo AD-19 convention — agent chạy test đồng nhất qua make test.

## Dependency: S-1.5/TASK-1 phải hoàn thành trước.

## File: Makefile

```makefile
.PHONY: test dev build lint compile

test:
	npm test

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

compile:
	npx tsc --noEmit
```

## Verify

- make test → chạy npm test không lỗi

- make dev → khởi động Next.js dev server trên port 3000

- make build → Next.js production build thành công, không có TypeScript errors

- make lint → ESLint chạy không có lỗi

- make compile → tsc --noEmit pass, không có type errors (nhanh hơn make build)

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

- Makefile

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

