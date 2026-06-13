'use server'

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

export async function verifyEmailAction(token: string) {
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/verify-email?token=${token}`, {
      method: 'POST'
    })
    if (!res.ok) return { error: 'Link expired or invalid. Please request a new one.' }
    return { success: true }
  } catch (e) {
    return { error: 'Connection error. Please try again.' }
  }
}

export async function resendVerificationAction(email: string) {
  try {
    await fetch(`${process.env.API_BASE_URL}/api/v1/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
  } catch (e) {
    // Always succeed (don't reveal email existence)
  }
}

