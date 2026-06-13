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
- app/login/page.tsx
- app/actions/auth.ts

## This specific task
## Mục tiêu

Tạo /login page với form React Hook Form + Zod validation, và loginAction Server Action gọi API backend.

## Dependency: S-1.5/TASK-5 (lib/api.ts), S-2.1/TASK-5 (login endpoint exists).

## File: src/app/(auth)/login/page.tsx

```typescript
import LoginForm from './_components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-teal-600">TBA</h1>
        <p className="text-center text-gray-500 mb-8">Sign in to your account</p>
        <LoginForm />
      </div>
    </div>
  )
}
```

## File: src/app/(auth)/login/_components/LoginForm.tsx

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input

## Task scope — CRITICAL
Implement ONLY what is described in "This specific task" above.
Do NOT implement register pages, admin pages, or any other features not mentioned in this task.
The task prompt may include broader story context for reference — ignore it and focus only on this task.
