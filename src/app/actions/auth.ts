'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(data: { email: string; password: string }) {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const msg = res.status === 429 ? 'Too many attempts. Try again later.'
        : body.error === 'EMAIL_NOT_VERIFIED' ? 'Please verify your email first.'
        : 'Invalid email or password'
      return { error: msg }
    }

    // Forward Set-Cookie headers from backend to browser
    const cookieStore = await cookies()
    for (const setCookie of res.headers.getSetCookie()) {
      const [nameVal] = setCookie.split(';')
      const [name, value] = nameVal.split('=')
      cookieStore.set(name.trim(), value.trim(), { httpOnly: true, path: '/' })
    }
  } catch (e) {
    return { error: 'Connection error. Please try again.' }
  }
  redirect('/projects')
}

export async function registerAction(data: {
  email: string
  password: string
  displayName: string
}) {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const isConflict = res.status === 409 || body.error === 'EMAIL_CONFLICT'
      return {
        error: isConflict ? 'Email already registered' : 'Registration failed',
      }
    }

    return { success: true }
  } catch (e) {
    return { error: 'Connection error. Please try again.' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('tba_refresh_token')?.value

  // Best-effort: call logout endpoint to revoke refresh token in DB
  if (refreshToken) {
    try {
      await fetch(`${process.env.API_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Cookie: `tba_refresh_token=${refreshToken}` },
      })
    } catch {
      // Ignore network errors — still clear cookies
    }
  }

  // Clear cookies regardless
  cookieStore.delete('tba_access_token')
  cookieStore.delete('tba_refresh_token')

  redirect('/login')
}

