import { logoutAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-teal-600">TBA</span>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">Sign out</Button>
        </form>
      </nav>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
