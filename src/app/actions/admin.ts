'use server'
import { apiFetch } from '@/lib/api'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateProjectStatusAction(
  projectId: string,
  newStatus: string,
  reason: string | null,
  forceRevision: boolean
) {
  const cookieStore = await cookies()
  await apiFetch(
    `/api/v1/admin/projects/${projectId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify({ newStatus, reason, forceRevision }),
    },
    cookieStore.toString()
  )
  revalidatePath(`/admin/projects/${projectId}`)
  revalidatePath('/admin')
}
