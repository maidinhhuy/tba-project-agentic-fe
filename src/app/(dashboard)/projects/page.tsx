import { Suspense } from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectCard } from '@/components/ProjectCard'
import { apiFetch } from '@/lib/api'

async function ProjectsList() {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()

  const data = await apiFetch<{ items: ProjectSummary[]; total: number }>(
    '/api/v1/customer/projects',
    { cache: 'no-store' },
    cookieHeader
  )

  if (data.items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg mb-4">No projects yet</p>
        <p className="text-gray-400 mb-6">Submit your first project to get started</p>
        <Button asChild>
          <Link href="/projects/new">Submit a Project</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.items.map(project => (
        <ProjectCard key={project.projectId} {...project} />
      ))}
    </div>
  )
}

function ProjectsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="border rounded-lg p-4 space-y-3" aria-busy="true">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CustomerDashboard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Button asChild>
          <Link href="/projects/new">+ Submit Project</Link>
        </Button>
      </div>
      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsList />
      </Suspense>
    </div>
  )
}

interface ProjectSummary {
  projectId: string
  name: string
  productType: string | null
  status: string
  revisionCount: number
  createdAt: string
  updatedAt: string
}
