'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { verifyEmailAction, resendVerificationAction } from '../actions'
import { Button } from '@/components/ui/button'

type State = 'pending' | 'verifying' | 'success' | 'error' | 'resent'

export default function VerifyEmailClient() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')
  const email = params.get('email') ?? ''
  const [state, setState] = useState<State>(token ? 'verifying' : 'pending')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      verifyEmailAction(token).then(result => {
        if (result?.error) { setState('error'); setMessage(result.error) }
        else setState('success')
      })
    }
  }, [token])

  if (state === 'verifying') return <p>Verifying your email...</p>
  if (state === 'success') return (
    <div>
      <p className="text-green-600 font-semibold mb-4">Email verified!</p>
      <Button onClick={() => router.push('/login')}>Go to Login</Button>
    </div>
  )
  if (state === 'error') return (
    <div>
      <p className="text-red-500 mb-4">{message}</p>
      <Button variant="outline" onClick={() => setState('pending')}>Resend email</Button>
    </div>
  )

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Check your inbox</h2>
      <p className="text-gray-500 mb-6">We sent a verification link to <strong>{email}</strong></p>
      {state === 'resent' && <p className="text-green-600 mb-4">Email resent!</p>}
      <Button variant="outline" onClick={async () => {
        await resendVerificationAction(email)
        setState('resent')
      }}>Resend verification email</Button>
    </div>
  )
}
