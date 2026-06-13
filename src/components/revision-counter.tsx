import { cn } from '@/lib/cn'

interface RevisionCounterProps {
  count: number
  className?: string
  showLabel?: boolean
}

export function RevisionCounter({ count, className, showLabel = true }: RevisionCounterProps) {
  const isExhausted = count === 0
  const isLow = count === 1

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      {showLabel && (
        <span className="text-sm text-gray-500">Revisions remaining:</span>
      )}
      <span className={cn(
        'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold border-2',
        isExhausted
          ? 'bg-red-100 text-red-700 border-red-400'
          : isLow
          ? 'bg-orange-100 text-orange-700 border-orange-400'
          : 'bg-teal-50 text-teal-700 border-teal-300'
      )}>
        {count}
      </span>
      {isExhausted && (
        <span className="text-xs text-red-500 font-medium">No revisions left</span>
      )}
    </div>
  )
}
