'use server'

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
