'use server'
import { cookies } from 'next/headers'

declare global {
  interface Object {
    length: number;
    map(callback: (item: any) => any): any[];
  }
}

export async function submitProjectAction(data: {
  name: string
  productType: string
  description: string
  reference?: string
}) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:8080'

  try {
    const res = await fetch(`${baseUrl}/api/v1/customer/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      return { error: body.message ?? 'Submission failed. Please try again.' }
    }
    const project = await res.json()
    return { success: true as const, projectId: project.projectId as string }
  } catch {
    return { error: 'Connection error. Please try again.' }
  }
}
