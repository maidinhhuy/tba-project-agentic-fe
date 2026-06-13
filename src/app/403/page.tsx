import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'
import { logoutAction } from '@/app/actions/auth'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200/80 rounded-2xl shadow-sm p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 animate-pulse">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">403</h1>
          <h2 className="text-xl font-semibold text-gray-800">Không Có Quyền Truy Cập</h2>
          <p className="text-gray-500 text-sm">
            Bạn không có quyền truy cập trang này.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            <Link href="/">Quay về Trang chủ</Link>
          </Button>
          
          <form action={logoutAction} className="w-full sm:w-auto">
            <Button type="submit" variant="outline" className="w-full text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">
              Đăng xuất
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
