import { Suspense, ReactNode } from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/status-badge'
import { apiFetch } from '@/lib/api'

interface ProjectSummary {
  projectId: string;
  name?: string;
  projectName?: string;
  productType?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  activeMilestoneName?: string | null;
  status: string;
  revisionCount: number;
  createdAt: string;
  updatedAt?: string;
}

interface PagedResponse {
  items: ProjectSummary[];
  total: number;
  page: number;
  size: number;
}

const ALL_STATUSES = [
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'ANALYZING', label: 'Analyzing' },
  { value: 'IN_DEVELOPMENT', label: 'In Development' },
  { value: 'AWAITING_REVIEW', label: 'Awaiting Review' },
  { value: 'IN_REVISION', label: 'In Revision' },
  { value: 'FINALIZING', label: 'Finalizing' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

// Helper to build URL with search params
function getFilterUrl(
  currentStatus: string[],
  statusToToggle: string,
  currentSortBy?: string,
  currentSortDir?: string
) {
  let newStatuses: string[]
  if (currentStatus.includes(statusToToggle)) {
    newStatuses = currentStatus.filter(s => s !== statusToToggle)
  } else {
    newStatuses = [...currentStatus, statusToToggle]
  }
  
  const params = new URLSearchParams()
  if (newStatuses.length > 0) {
    params.set('status', newStatuses.join(','))
  }
  if (currentSortBy) {
    params.set('sortBy', currentSortBy)
  }
  if (currentSortDir) {
    params.set('sortDir', currentSortDir)
  }
  
  const qs = params.toString()
  return `/admin${qs ? `?${qs}` : ''}`
}

function getSortUrl(
  currentStatus: string[],
  targetSortBy: string,
  currentSortBy?: string,
  currentSortDir?: string
) {
  const params = new URLSearchParams()
  if (currentStatus.length > 0) {
    params.set('status', currentStatus.join(','))
  }
  
  if (currentSortBy === targetSortBy) {
    if (currentSortDir === 'asc') {
      params.set('sortBy', targetSortBy)
      params.set('sortDir', 'desc')
    } else if (currentSortDir === 'desc') {
      // Reset sort when toggling past desc
    } else {
      params.set('sortBy', targetSortBy)
      params.set('sortDir', 'asc')
    }
  } else {
    params.set('sortBy', targetSortBy)
    params.set('sortDir', 'asc')
  }
  
  const qs = params.toString()
  return `/admin${qs ? `?${qs}` : ''}`
}

const getClearUrl = () => '/admin'

function renderSortIcon(col: string, sortBy?: string, sortDir?: string) {
  if (sortBy !== col) {
    return (
      <svg className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
      </svg>
    )
  }
  if (sortDir === 'asc') {
    return (
      <svg className="w-3.5 h-3.5 text-teal-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )
  }
  return (
    <svg className="w-3.5 h-3.5 text-teal-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string
    sortBy?: string
    sortDir?: string
  }>
}) {
  const resolvedParams = await searchParams
  const status = resolvedParams.status
  const sortBy = resolvedParams.sortBy
  const sortDir = resolvedParams.sortDir

  const activeStatuses = status ? status.split(',').filter(Boolean) : []

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

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">All Projects</h1>
            <p className="text-gray-500 text-sm mt-1">Danh sách tất cả dự án trong hệ thống</p>
          </div>
        </div>

        {/* Filters & Sorting Panel */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Lọc theo trạng thái</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_STATUSES.map((statusItem) => {
                const isActive = activeStatuses.includes(statusItem.value)
                const toggleUrl = getFilterUrl(activeStatuses, statusItem.value, sortBy, sortDir)
                
                return (
                  <Link
                    key={statusItem.value}
                    href={toggleUrl}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {isActive && (
                      <svg className="w-3 h-3 mr-1.5 text-teal-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {statusItem.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mr-2">Sắp xếp theo:</span>
              {[
                { value: 'status', label: 'Trạng thái' },
                { value: 'updatedAt', label: 'Cập nhật lúc' },
              ].map((sortItem) => {
                const isActive = sortBy === sortItem.value
                const sortUrl = getSortUrl(activeStatuses, sortItem.value, sortBy, sortDir)
                
                return (
                  <Link
                    key={sortItem.value}
                    href={sortUrl}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 select-none ${
                      isActive
                        ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {sortItem.label}
                    {isActive && (
                      sortDir === 'asc' ? (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )
                    )}
                  </Link>
                )
              })}
            </div>

            {(activeStatuses.length > 0 || sortBy || sortDir) && (
              <Link
                href={getClearUrl()}
                className="inline-flex items-center text-xs font-medium text-red-600 hover:text-red-700 transition-colors self-start sm:self-auto select-none"
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xoá bộ lọc
              </Link>
            )}
          </div>
        </div>

        {/* Data Container with Suspense */}
        <Suspense key={JSON.stringify(resolvedParams)} fallback={<AdminProjectsTableSkeleton />}>
          <AdminProjectsTable
            searchParams={{
              status,
              sortBy,
              sortDir,
            }}
            activeStatuses={activeStatuses}
            sortBy={sortBy}
            sortDir={sortDir}
          />
        </Suspense>
      </div>
    </main>
  )
}

function AdminProjectsTableSkeleton() {
  return (
    <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden" aria-busy="true">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/75 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Tên dự án</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Milestone active</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Cập nhật lúc</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i} className="hover:bg-gray-50/50" aria-busy="true">
                <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-24 bg-gray-200" /></td>
                <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-40 bg-gray-200" /></td>
                <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-6 w-20 rounded-full bg-gray-200" /></td>
                <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-28 bg-gray-200" /></td>
                <td className="px-6 py-4 whitespace-nowrap"><Skeleton className="h-4 w-32 bg-gray-200" /></td>
                <td className="px-6 py-4 whitespace-nowrap text-right"><Skeleton className="h-8 w-16 rounded bg-gray-200 ml-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List Skeleton */}
      <div className="block md:hidden divide-y divide-gray-100">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-5 space-y-3 bg-white" aria-busy="true">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200" />
            </div>
            <Skeleton className="h-5 w-48 bg-gray-200" />
            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
              <Skeleton className="h-3 w-32 bg-gray-200" />
              <Skeleton className="h-3 w-24 bg-gray-200" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-8 w-full rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

async function AdminProjectsTable({
  searchParams,
  activeStatuses,
  sortBy,
  sortDir,
}: {
  searchParams: {
    status?: string
    sortBy?: string
    sortDir?: string
  }
  activeStatuses: string[]
  sortBy?: string
  sortDir?: string
}) {
  const cookieStore = await cookies()
  
  const fetchParams: Record<string, string | number> = {}
  if (searchParams.status) {
    fetchParams.status = searchParams.status
  }
  if (searchParams.sortBy) {
    fetchParams.sortBy = searchParams.sortBy
  }
  if (searchParams.sortDir) {
    fetchParams.sortDir = searchParams.sortDir
  }

  let data: ProjectSummary[]
  try {
    data = await apiFetch<ProjectSummary[]>(
      '/api/v1/admin/projects',
      {
        cache: 'no-store',
        params: fetchParams,
      },
      cookieStore.toString()
    )
  } catch (e: any) {
    if (e.status === 401) {
      return (
        <div className="text-center py-12 bg-white rounded-xl border border-red-100 shadow-sm max-w-xl mx-auto p-6">
          <p className="text-red-500 font-medium">Bạn không có quyền truy cập trang này.</p>
        </div>
      )
    }
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-red-100 shadow-sm max-w-xl mx-auto p-6">
        <p className="text-red-500 font-medium">Đã xảy ra lỗi khi tải danh sách dự án.</p>
        <p className="text-gray-400 mt-2 text-sm">Vui lòng thử lại sau.</p>
      </div>
    )
  }

  if (!data || !data || data.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200/80 shadow-sm max-w-xl mx-auto p-8">
        <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có dự án nào được gửi.</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Hiện tại không tìm thấy dự án nào khớp với bộ lọc đã chọn.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Show count of projects matching the criteria */}
      <div className="flex items-center justify-between px-1">
        <p className="text-gray-500 text-sm">{data.length} total projects</p>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/75 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Tên dự án</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Link href={getSortUrl(activeStatuses, 'status', sortBy, sortDir)} className="hover:text-teal-600 transition-colors flex items-center gap-1.5 select-none group font-semibold uppercase">
                    Trạng thái
                    {renderSortIcon('status', sortBy, sortDir)}
                  </Link>
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Milestone active</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <Link href={getSortUrl(activeStatuses, 'updatedAt', sortBy, sortDir)} className="hover:text-teal-600 transition-colors flex items-center gap-1.5 select-none group font-semibold uppercase">
                    Cập nhật lúc
                    {renderSortIcon('updatedAt', sortBy, sortDir)}
                  </Link>
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((project) => {
                const customerInfo = project.customerName || project.customerEmail || '—'
                const projectName = project.projectName || project.name || '—'
                const milestoneInfo = project.activeMilestoneName || project.productType || '—'
                const dateVal = project.updatedAt || project.createdAt
                const formattedDate = dateVal
                  ? new Date(dateVal).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'

                return (
                  <tr key={project.projectId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customerInfo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {milestoneInfo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formattedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button asChild variant="outline" size="sm" className="hover:border-teal-500 hover:text-teal-600 transition-colors">
                        <Link href={`/admin/projects/${project.projectId}`}>
                          Quản lý <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-gray-100">
          {data.map((project) => {
            const customerInfo = project.customerName || project.customerEmail || '—'
            const projectName = project.projectName || project.name || '—'
            const milestoneInfo = project.activeMilestoneName || project.productType || '—'
            const dateVal = project.updatedAt || project.createdAt
            const formattedDate = dateVal
              ? new Date(dateVal).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '—'

            return (
              <div key={project.projectId} className="p-5 space-y-3 bg-white hover:bg-gray-50/30 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider bg-teal-50 border border-teal-100 px-2.5 py-0.5 rounded-full">
                    {customerInfo}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <h4 className="font-semibold text-gray-900 text-base">{projectName}</h4>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <span>Milestone: <strong>{milestoneInfo}</strong></span>
                  <span>{formattedDate}</span>
                </div>
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm" className="w-full text-center py-2">
                    <Link href={`/admin/projects/${project.projectId}`}>
                      Quản lý <span className="sr-only">View</span>
                    </Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
