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
- app/register/page.tsx
- app/actions/auth.ts

## This specific task
## Mục tiêu

Tạo /register page với form validation và registerAction Server Action gọi backend registration API.

## Dependency: S-2.4/TASK-1, S-2.3/TASK-4 (register endpoint exists).

## File: src/app/(auth)/register/page.tsx

```typescript
import RegisterForm from './_components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2 text-teal-600">TBA</h1>
        <p className="text-center text-gray-500 mb-8">Create your account</p>
        <RegisterForm />
      </div>
    </div>
  )
}
```

## File: src/app/(auth)/register/_components/RegisterForm.tsx

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerAction } from '../actions'
import { Button } from '@/components/ui/button'
import {

## Task scope — CRITICAL
Implement ONLY what is described in "This specific task" above.
Do NOT implement register pages, admin pages, or any other features not mentioned in this task.
The task prompt may include broader story context for reference — ignore it and focus only on this task.
