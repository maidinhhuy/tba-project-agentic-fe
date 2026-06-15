'use client'

import { useState, useTransition } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { updateProjectStatusAction } from '@/app/actions/admin'
import { toast as sonnerToast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

// Local useToast hook to support the template syntax with the installed sonner library
function useToast() {
  const toast = ({ title, duration, variant }: { title: string; duration?: number; variant?: string }) => {
    if (variant === 'destructive') {
      sonnerToast.error(title, { duration: duration ?? 4000 })
    } else {
      sonnerToast.success(title, { duration: duration ?? 4000 })
    }
  }
  return { toast }
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

export function UpdateStatusForm({
  projectId,
  currentStatus,
  allowedTransitions,
  revisionCount,
  version
}: {
  projectId: string
  currentStatus: string
  allowedTransitions: string[]
  revisionCount: number
  version: number
}) {
  const [newStatus, setNewStatus] = useState('')
  const [reason, setReason] = useState('')
  const [showWarning, setShowWarning] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSubmit = (forceRevision = false) => {
    if (newStatus === 'IN_REVISION' && revisionCount === 0 && !forceRevision) {
      setShowWarning(true)
      return
    }
    startTransition(async () => {
      try {
        await updateProjectStatusAction(projectId, newStatus, reason || null, forceRevision)
        toast({ title: 'Updated and notified the customer.', duration: 4000 })
        setNewStatus('')
        setReason('')
      } catch (e: unknown) {
        toast({ title: e instanceof Error ? e.message : 'An error occurred.', variant: 'destructive' })
      }
    })
  }

  return (
    <div className="border border-gray-200/80 rounded-xl p-5 bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 text-lg">Update status</h2>
        <div className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          Remaining revisions: <strong className="text-gray-700">{revisionCount}</strong>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">New Status</label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger className="w-full border-gray-200 focus:ring-teal-500">
              <SelectValue placeholder="Select new status..." />
            </SelectTrigger>
            <SelectContent>
              {allowedTransitions.map(s => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s] ?? s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Notes for customer</label>
          <Textarea
            placeholder="Notes for customer (optional)..."
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            className="border-gray-200 focus:ring-teal-500 resize-none"
          />
        </div>

        <div className="pt-2">
          <Button
            onClick={() => handleSubmit()}
            disabled={!newStatus || isPending}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save & Notify'}
          </Button>
        </div>
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              Confirm status change
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-destructive mt-3">
              ⚠️ The customer has no revisions remaining. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWarning(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setShowWarning(false)
                handleSubmit(true)
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
