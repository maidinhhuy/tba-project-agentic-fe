import { cn } from '@/lib/cn'

type ProjectStatus =
  | 'SUBMITTED' | 'ANALYZING' | 'IN_DEVELOPMENT'
  | 'AWAITING_REVIEW' | 'IN_REVISION' | 'FINALIZING'
  | 'DELIVERED' | 'CANCELLED'

const STATUS_CONFIG: Record<ProjectStatus, { label: string; className: string }> = {
  SUBMITTED:       { label: 'Submitted',       className: 'status-submitted' },
  ANALYZING:       { label: 'Analyzing',       className: 'status-analyzing' },
  IN_DEVELOPMENT:  { label: 'In Development',  className: 'status-in-development' },
  AWAITING_REVIEW: { label: 'Awaiting Review', className: 'status-awaiting-review' },
  IN_REVISION:     { label: 'In Revision',     className: 'status-in-revision' },
  FINALIZING:      { label: 'Finalizing',      className: 'status-finalizing' },
  DELIVERED:       { label: 'Delivered',       className: 'status-delivered' },
  CANCELLED:       { label: 'Cancelled',       className: 'status-cancelled' },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as ProjectStatus] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-600 border-gray-300'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
      aria-label={`Status: ${config.label}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {config.label}
    </span>
  )
}
