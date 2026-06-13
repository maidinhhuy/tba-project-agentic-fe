import Link from 'next/link'
import { cn } from '@/lib/cn'
import { StatusBadge } from './status-badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface ProjectCardProps {
  projectId: string
  name: string
  productType: string | null
  status: string
  revisionCount: number
  createdAt: string
  className?: string
}

export function ProjectCard({
  projectId, name, productType, status, revisionCount, createdAt, className
}: ProjectCardProps) {
  const createdDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <Link href={`/projects/${projectId}`} className="block group">
      <Card className={cn(
        'transition-all duration-200 hover:shadow-md hover:border-teal-300 cursor-pointer',
        className
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors line-clamp-2">
              {name}
            </h3>
            <StatusBadge status={status} className="shrink-0" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              {productType && (
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                  {productType}
                </span>
              )}
              <span>Submitted {createdDate}</span>
            </div>
            <div className={cn(
              'text-xs font-medium',
              revisionCount === 0 ? 'text-red-500' : 'text-gray-500'
            )}>
              {revisionCount} revision{revisionCount !== 1 ? 's' : ''} left
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
