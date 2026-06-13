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
- app/register/verify-email/page.tsx
- app/actions/auth.ts

## This specific task
## Mục tiêu

Tạo /register/verify-email page: hiển thị hướng dẫn, xử lý click verify link (token từ URL), và form resend email.

## Dependency: S-2.4/TASK-2, S-2.3/TASK-4 (verify/resend endpoints exists).

## File: src/app/(auth)/register/verify-email/page.tsx

```typescript
import { Suspense } from 'react'
import VerifyEmailClient from './_components/VerifyEmailClient'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow text-center">
        <Suspense fallback={<p>Loading...</p>}>
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  )
}
```

## File: src/app/(auth)/register/verify-email/_components/VerifyEmailClient.tsx

```typescript
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { verifyEmailAction, resendVerificationAction } from '

## Task scope — CRITICAL
Implement ONLY what is described in "This specific task" above.
Do NOT implement register pages, admin pages, or any other features not mentioned in this task.
The task prompt may include broader story context for reference — ignore it and focus only on this task.
