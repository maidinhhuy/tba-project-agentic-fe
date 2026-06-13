# Agent Instructions

## Scope — CRITICAL
- Work ONLY within this repository directory. Do NOT read or access any paths outside this workspace.
- Do NOT access /opt, /etc, /root, /workspace (other workspaces), or any system directories.
- Do NOT run npm install, pnpm install, or any package manager commands. Dependencies are already installed by the CI environment.
- Do NOT read node_modules, .next, .pnpm-store, or build artifact directories.
- Do NOT check running processes, ports, or system services.
- Do NOT read files from git history of other branches unless directly relevant to the task.

## Files to work on
Only create or modify these files:
- lib/api.ts
- middleware.ts
- next.config.ts

## This specific task
## Mục tiêu

Tạo lib/api.ts (HTTP client wrapper) và middleware.ts (route protection) cho Next.js frontend.

## Dependency: S-1.5/TASK-4 phải hoàn thành trước.

## File: src/lib/api.ts

```typescript
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8080'

type FetchOptions = RequestInit & {
  params?: Record<string, string | number>
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
  cookie?: string
): Promise<T> {
  const { params, ...init } = options

  let url = `${API_BASE}${path}`
  if (params) {
    const qs = new URLSearchParams(Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ))
    url += `?${qs.toString()}`
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(cookie ? { Cookie: cookie } : {}),
    ...init.headers,
  }

  const res = await fetch(url, { ...init, headers })

  if (res.status === 401) {
    // Caller (Server Component/Action) must handle redirect t

## Task scope — CRITICAL
Implement ONLY what is described in "This specific task" above.
Do NOT implement register pages, admin pages, or any other features not mentioned in this task.
The task prompt may include broader story context for reference — ignore it and focus only on this task.
