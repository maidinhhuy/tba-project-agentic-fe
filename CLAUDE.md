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
- app/layout.tsx
- app/actions/auth.ts

## This specific task
## Mục tiêu

Tạo logoutAction Server Action để clear cookies và redirect về /login.

## Dependency: S-2.4/TASK-1 phải hoàn thành trước.

## File: src/app/actions/auth.ts

```typescript
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function logoutAction() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('tba_refresh_token')?.value

  // Best-effort: call logout endpoint to revoke refresh token in DB
  if (refreshToken) {
    try {
      await fetch(`${process.env.API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Cookie: `tba_refresh_token=${refreshToken}` },
      })
    } catch {
      // Ignore network errors — still clear cookies
    }
  }

  // Clear cookies regardless
  cookieStore.delete('tba_access_token')
  cookieStore.delete('tba_refresh_token')

  redirect('/login')
}
```

## Cập nhật Dashboard layout để có Logout button

### src/app/(dashboard)/layout.tsx

## Task scope — CRITICAL
Implement ONLY what is described in "This specific task" above.
Do NOT implement register pages, admin pages, or any other features not mentioned in this task.
The task prompt may include broader story context for reference — ignore it and focus only on this task.
