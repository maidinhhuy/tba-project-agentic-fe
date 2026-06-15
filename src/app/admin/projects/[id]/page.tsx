import { cookies } from 'next/headers'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { StatusBadge } from '@/components/status-badge'
import { UpdateStatusForm } from './UpdateStatusForm'

interface AdminProjectDetail {
  projectId: string
  name: string
  customerEmail: string
  status: string
  allowedTransitions: string[]
  revisionCount: number
  milestones: { milestoneId: string; name: string; status: string; position: number }[]
  statusHistory: {
    previousStatus: string | null
    newStatus: string
    changedBy: string
    reason: string | null
    changedAt: string
  }[]
  version: number
}

const STATUS_LABELS: Record<string, string> = {
  SUBMITTED: 'Submitted',
  ANALYZING: 'Analyzing',
  IN_DEVELOPMENT: 'In Development',
  AWAITING_REVIEW: 'Awaiting Review',
  IN_REVISION: 'In Revision',
  FINALIZING: 'Finalizing',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies()
  const project = await apiFetch<AdminProjectDetail>(
    `/api/v1/admin/projects/${id}`,
    { cache: 'no-store' },
    cookieStore.toString()
  )

  return (
    <main className="min-h-screen bg-gray-50/50 pb-12">
      {/* Navigation Header */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            TBA
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-500">Admin Portal</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        {/* Back Link */}
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Admin
        </Link>

        {/* Project Header Card */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{project.customerEmail}</p>
          </div>
          <StatusBadge status={project.status} className="self-start sm:self-center" />
        </div>

        {/* Update Form Component */}
        <UpdateStatusForm
          projectId={project.projectId}
          currentStatus={project.status}
          allowedTransitions={project.allowedTransitions}
          revisionCount={project.revisionCount}
          version={project.version}
        />

        {/* Milestones Card */}
        {project.milestones && project.milestones.length > 0 && (
          <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-100">Project milestones</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[...project.milestones]
                .sort((a, b) => a.position - b.position)
                .map((m) => (
                  <div key={m.milestoneId} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-gray-50/50">
                    <span className="text-sm font-medium text-gray-700">{m.name}</span>
                    <span className="text-xs bg-teal-50 text-teal-700 border border-teal-100 px-2 py-0.5 rounded-full font-medium">
                      {m.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Status History Card */}
        {project.statusHistory.length > 0 && (
          <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 pb-3 border-b border-gray-100">Status history</h2>
            <div className="space-y-3 pt-1">
              {project.statusHistory.map((h, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm p-4 bg-gray-50 rounded-lg border border-gray-100/50">
                  <span className="text-gray-400 text-xs whitespace-nowrap min-w-[140px]">
                    {new Date(h.changedAt).toLocaleString('en-US')}
                  </span>
                  <div className="flex-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-gray-600">
                      {h.previousStatus ?? '—'} → <strong>{h.newStatus}</strong>
                    </span>
                    <span className="text-gray-400 text-xs font-medium">({h.changedBy})</span>
                    {h.reason && (
                      <span className="text-gray-500 italic pl-2 border-l border-gray-200 block sm:inline">
                        &quot;{h.reason}&quot;
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
