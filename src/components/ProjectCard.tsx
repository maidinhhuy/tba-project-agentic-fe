import Link from 'next/link'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'

interface ProjectCardProps {
  projectId: string
  name: string
  productType: string | null
  status: string
  revisionCount: number
  createdAt: string
  updatedAt: string
}

const getMilestoneSubtitle = (status: string, productType: string | null) => {
  switch (status) {
    case 'SUBMITTED':
      return 'Milestone 1: Submitted'
    case 'ANALYZING':
      return 'Milestone 2: Analyzing'
    case 'IN_DEVELOPMENT':
      return 'Milestone 3: In Development'
    case 'AWAITING_REVIEW':
      return 'Milestone 4: Awaiting Review'
    case 'IN_REVISION':
      return 'Milestone 5: In Revision'
    case 'FINALIZING':
      return 'Milestone 6: Finalizing'
    case 'DELIVERED':
      return 'Milestone 7: Delivered'
    default:
      return productType || 'Project'
  }
}

export function ProjectCard({
  projectId,
  name,
  productType,
  status,
  revisionCount,
  createdAt,
  updatedAt,
}: ProjectCardProps) {
  const dateStr = new Date(updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <Link href={`/projects/${projectId}`} className="block">
      <Card className="hover:border-teal-300 hover:shadow-sm transition-all duration-200 cursor-pointer h-full flex flex-col justify-between border border-border bg-card text-card-foreground">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold text-gray-900 line-clamp-1">{name}</h3>
            <StatusBadge status={status} className="shrink-0" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {getMilestoneSubtitle(status, productType)}
          </p>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex justify-between items-center mt-auto">
          <span className="text-xs text-gray-400">{dateStr}</span>
          <span className="text-xs font-medium text-teal-600 hover:underline">
            View details
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
