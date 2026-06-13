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
      return {
        error: res.status === 429 ? 'Too many attempts. Try again later.'
          : body.error === 'EMAIL_NOT_VERIFIED' ? 'Please verify your email first.'
          : 'Invalid email or password'
      }
    }
    const cookieStore = await cookies()
    for (const setCookie of res.headers.getSetCookie()) {
      const [nameVal] = setCookie.split(';')
      const [name, value] = nameVal.split('=')
      cookieStore.set(name.trim(), value.trim(), { httpOnly: true, path: '/' })
    }
  } catch {
    return { error: 'Connection error. Please try again.' }
  }
  redirect('/projects')
}
