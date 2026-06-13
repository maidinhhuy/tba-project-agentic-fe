import { Suspense } from 'react'
import VerifyEmailClient from './_components/VerifyEmailClient'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow text-center">
        <Suspense fallback={<p>Loading...</p>}>
          <VerifyEmailClient />
        </Suspense>
      </div>
    </div>
  )
}
