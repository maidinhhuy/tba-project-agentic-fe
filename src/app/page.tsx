import { Suspense } from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectCard } from '@/components/ProjectCard'
import { StatusBadge } from '@/components/status-badge'
import { apiFetch } from '@/lib/api'
import { logoutAction } from '@/app/actions/auth'

interface ProjectSummary {
  projectId: string
  name: string
  productType: string | null
  status: string
  revisionCount: number
  createdAt: string
  updatedAt: string
}

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('utf-8')
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

async function ProjectsList() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  let data: { items: ProjectSummary[]; total: number }
  try {
    data = await apiFetch<{ items: ProjectSummary[]; total: number }>(
      '/api/v1/customer/projects',
      { cache: 'no-store' },
      cookieHeader
    )
  } catch (err) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-red-100 shadow-sm max-w-xl mx-auto p-6">
        <p className="text-red-500 font-medium">Đã xảy ra lỗi khi tải danh sách dự án.</p>
        <p className="text-gray-400 mt-2 text-sm">Vui lòng thử lại sau.</p>
      </div>
    )
  }

  if (data.items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm max-w-xl mx-auto p-8">
        <div className="mx-auto w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 text-teal-500">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Bạn chưa có dự án nào</h3>
        <p className="text-gray-500 mb-6 text-sm max-w-md mx-auto">
          Bắt đầu quản lý dự án của bạn bằng cách tạo dự án đầu tiên ngay bây giờ.
        </p>
        <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
          <Link href="/projects/new">Tạo dự án đầu tiên</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
      {data.items.map(project => (
        <ProjectCard key={project.projectId} {...project} />
      ))}
    </div>
  )
}

function ProjectsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="border border-border rounded-xl p-5 space-y-4 bg-white shadow-sm flex flex-col justify-between h-[155px]"
          aria-busy="true"
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <Skeleton className="h-5 w-2/3 bg-gray-200" />
              <Skeleton className="h-6 w-20 rounded-full bg-gray-200 shrink-0" />
            </div>
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <Skeleton className="h-4 w-16 bg-gray-200" />
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('tba_access_token')?.value

  let user: { displayName?: string; email?: string; role?: string } | null = null
  if (token) {
    user = decodeJwt(token)
  }

  const displayName = user?.displayName || user?.email || 'Khách hàng'

  return (
    <main className="min-h-screen bg-gray-50/50 pb-12">
      {/* Navigation Bar */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-2xl bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
            TBA
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-medium text-gray-500 hidden sm:inline">Workspace</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-gray-700">{displayName}</span>
              {user.role === 'ADMIN' && (
                <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                  Admin
                </span>
              )}
            </div>
          )}
          {token ? (
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm" className="text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
                Đăng xuất
              </Button>
            </form>
          ) : (
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                <Link href="/register">Đăng ký</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200/80 py-8 px-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Chào mừng trở lại, {displayName}</h1>
            <p className="text-gray-500 mt-1">Hệ thống quản lý và bàn giao dự án</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button asChild variant="outline">
              <Link href="/projects">Tất cả dự án</Link>
            </Button>
            <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
              <Link href="/projects/new">+ Tạo dự án mới</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Projects Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Dự án gần đây</h2>
          </div>
          <Suspense fallback={<ProjectsListSkeleton />}>
            <ProjectsList />
          </Suspense>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          {/* Quick Links Card */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50/50 p-2 rounded-lg transition-colors">
                  <span>Trang chủ</span>
                  <span className="text-xs text-gray-400">/</span>
                </Link>
              </li>
              <li>
                <Link href="/projects" className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50/50 p-2 rounded-lg transition-colors">
                  <span>Danh sách dự án</span>
                  <span className="text-xs text-gray-400">/projects</span>
                </Link>
              </li>
              <li>
                <Link href="/projects/new" className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50/50 p-2 rounded-lg transition-colors">
                  <span>Tạo dự án mới</span>
                  <span className="text-xs text-gray-400">/projects/new</span>
                </Link>
              </li>
              {user?.role === 'ADMIN' && (
                <li>
                  <Link href="/admin" className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50/50 p-2 rounded-lg transition-colors">
                    <span className="font-medium text-red-600">Quản trị viên</span>
                    <span className="text-xs text-gray-400">/admin</span>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/login" className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50/50 p-2 rounded-lg transition-colors">
                  <span>Đăng nhập</span>
                  <span className="text-xs text-gray-400">/login</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="flex items-center justify-between text-sm text-gray-600 hover:text-teal-600 hover:bg-teal-50/50 p-2 rounded-lg transition-colors">
                  <span>Đăng ký</span>
                  <span className="text-xs text-gray-400">/register</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Status Guide Card */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Quy trình dự án
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { status: 'SUBMITTED', desc: 'Dự án đã được gửi đi' },
                { status: 'ANALYZING', desc: 'Đang phân tích yêu cầu' },
                { status: 'IN_DEVELOPMENT', desc: 'Đang triển khai thực hiện' },
                { status: 'AWAITING_REVIEW', desc: 'Chờ khách hàng duyệt' },
                { status: 'IN_REVISION', desc: 'Đang chỉnh sửa theo phản hồi' },
                { status: 'FINALIZING', desc: 'Đang hoàn thiện sản phẩm' },
                { status: 'DELIVERED', desc: 'Đã bàn giao thành công' },
                { status: 'CANCELLED', desc: 'Dự án đã hủy' },
              ].map(item => (
                <div key={item.status} className="flex items-center justify-between gap-2 text-xs border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  <StatusBadge status={item.status} />
                  <span className="text-gray-500 text-right">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

