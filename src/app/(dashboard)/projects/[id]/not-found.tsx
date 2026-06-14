// Project not found page component
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dự án không tồn tại</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Project not found or you don’t have permission to access it.
      </p>
      <Button asChild variant="outline">
        <Link href="/projects" className="flex items-center gap-2">
          ← Quay lại Dashboard
        </Link>
      </Button>
    </div>
  )
}
