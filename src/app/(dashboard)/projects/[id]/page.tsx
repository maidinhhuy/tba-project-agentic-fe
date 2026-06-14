// Project detail page component
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { apiFetch, ApiError } from '@/lib/api'
import { StatusBadge } from '@/components/status-badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Milestone {
  milestoneId: number
  name: string
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED'
  position: number
}

interface StatusHistoryEntry {
  previousStatus: string | null
  newStatus: string
  changedBy: string
  reason: string | null
  changedAt: string
}

interface ProjectDetail {
  projectId: string
  name: string
  productType: string
  description: string
  reference: string | null
  status: string
  revisionCount: number
  milestones: Milestone[]
  statusHistory: StatusHistoryEntry[]
  createdAt: string
  updatedAt: string
  version: number
}

function MilestoneIcon({ status }: { status: 'ACTIVE' | 'PENDING' | 'COMPLETED' }) {
  if (status === 'COMPLETED') {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400" aria-label="Completed">
        <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    )
  }
  if (status === 'ACTIVE') {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white dark:bg-card" aria-label="Active">
        <span className="h-2.5 w-2.5 rounded-full bg-teal-500 ring-4 ring-teal-100 dark:ring-teal-950" />
      </span>
    )
  }
  return (
    <span className="flex h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800" aria-label="Pending" />
  )
}

function ProjectDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6" aria-busy="true">
      <div className="space-y-2 animate-pulse" aria-busy="true">
        <Skeleton className="h-4 w-24" aria-busy="true" />
        <Skeleton className="h-8 w-2/3" aria-busy="true" />
        <Skeleton className="h-4 w-32" aria-busy="true" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" aria-busy="true">
        <div className="md:col-span-8 space-y-6" aria-busy="true">
          <div className="border rounded-lg p-6 space-y-4" aria-busy="true">
            <Skeleton className="h-4 w-24" aria-busy="true" />
            {[0, 1, 2].map(i => (
              <Skeleton key={i} className="h-4 w-full" aria-busy="true" />
            ))}
          </div>
          <div className="border rounded-lg p-6 space-y-4" aria-busy="true">
            <Skeleton className="h-4 w-24" aria-busy="true" />
            {[0, 1, 2].map(i => (
              <Skeleton key={i} className="h-12 w-full" aria-busy="true" />
            ))}
          </div>
        </div>
        <div className="md:col-span-4" aria-busy="true">
          <div className="border rounded-lg p-6 space-y-4" aria-busy="true">
            <Skeleton className="h-4 w-24" aria-busy="true" />
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3" aria-busy="true">
                <Skeleton className="h-5 w-5 rounded-full" aria-busy="true" />
                <Skeleton className="h-4 w-full" aria-busy="true" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

async function ProjectDetailContent({ id }: { id: string }) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  let project: ProjectDetail
  try {
    project = await apiFetch<ProjectDetail>(
      `/api/v1/customer/projects/${id}`,
      { cache: 'no-store' },
      cookieHeader
    )
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      notFound()
    }
    throw e
  }

  const showRevisionCounter =
    project.status === 'AWAITING_REVIEW' || project.status === 'IN_REVISION'
  
  // Activity Feed shows statusHistory entries with reason not null, sorted changed_at DESC
  const activityEntries = project.statusHistory
    .filter(h => h.reason !== null)
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
  
  const sortedMilestones = [...project.milestones].sort((a, b) => a.position - b.position)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b">
        <div>
          <Link
            href="/projects"
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1.5 mb-3 font-medium transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {project.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
            {project.productType}
          </p>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 shrink-0">
          <StatusBadge status={project.status} className="text-sm px-3 py-1" />
          {showRevisionCounter && (
            <span
              id="revision-counter"
              className={`revision-counter inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                project.revisionCount <= 1
                  ? 'text-destructive text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50'
                  : 'text-teal-800 bg-teal-50 border border-teal-200 dark:text-teal-300 dark:bg-teal-950/30 dark:border-teal-800'
              }`}
            >
              {project.revisionCount <= 1
                ? 'Còn 1 lần chỉnh sửa cuối'
                : `Còn ${project.revisionCount} lần chỉnh sửa`}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Mô tả dự án / Description
              </h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
              {project.reference && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Tài liệu tham khảo / Reference
                  </h3>
                  <a
                    href={project.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium break-all"
                  >
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    {project.reference}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {activityEntries.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Lịch sử cập nhật / Activity
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {activityEntries.map((entry, i) => (
                    <li key={i} className="flex gap-4 text-sm items-start">
                      <time className="text-gray-400 dark:text-gray-500 shrink-0 font-medium tabular-nums min-w-[120px] pt-0.5">
                        {new Date(entry.changedAt).toLocaleString('vi-VN')}
                      </time>
                      <div className="flex-1 bg-gray-50 dark:bg-muted/50 rounded-lg p-3 border border-gray-100 dark:border-border/50">
                        <span className="text-gray-700 dark:text-gray-300 font-medium block">
                          {entry.reason}
                        </span>
                        {entry.changedBy && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                            Được thực hiện bởi: {entry.changedBy}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Mốc thời gian / Milestones
              </h2>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="relative border-l border-gray-200 dark:border-gray-800 ml-2.5 space-y-6">
                {sortedMilestones.map((m, i) => (
                  <li key={m.milestoneId} className="pl-6 relative">
                    <div className="absolute -left-[10px] top-0.5">
                      <MilestoneIcon status={m.status} />
                    </div>
                    <span
                      className={`text-sm block ${
                        m.status === 'ACTIVE'
                          ? 'font-semibold text-teal-700 dark:text-teal-400'
                          : m.status === 'COMPLETED'
                          ? 'text-gray-400 dark:text-gray-500 line-through'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {i + 1}. {m.name}
                    </span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailContent id={id} />
    </Suspense>
  )
}
