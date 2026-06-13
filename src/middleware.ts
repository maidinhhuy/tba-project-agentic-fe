import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/register', '/403']
const ADMIN_PATHS = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('tba_access_token')?.value

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Decode JWT payload (no verify — server verifies, FE just reads role)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (ADMIN_PATHS.some(p => pathname.startsWith(p)) && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
