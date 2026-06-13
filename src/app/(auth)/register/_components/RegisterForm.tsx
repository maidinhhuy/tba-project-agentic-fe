'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const schema = z.object({
  displayName: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/(?=.*[a-z])/, 'Needs lowercase')
    .regex(/(?=.*[A-Z])/, 'Needs uppercase')
    .regex(/(?=.*\d)/, 'Needs digit'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

export default function RegisterForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormValues>({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data: FormValues) => {
    const result = await registerAction(data)
    if (result?.error) {
      if (result.error.includes('already')) setError('email', { message: result.error })
      else setError('root', { message: result.error })
    } else {
      router.push(`/register/verify-email?email=${encodeURIComponent(data.email)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 rounded-lg shadow">
      <div>
        <Input placeholder="Full name" {...register('displayName')} />
        {errors.displayName && <p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>}
      </div>
      <div>
        <Input type="email" placeholder="Email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="Password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="Confirm password" {...register('confirmPassword')} />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account...' : 'Create account'}
      </Button>
      <p className="text-center text-sm text-gray-500">
        Have account? <a href="/login" className="text-teal-600 hover:underline">Sign in</a>
      </p>
    </form>
  )
}
