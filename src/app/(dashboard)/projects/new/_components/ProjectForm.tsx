'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { submitProjectAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const PRODUCT_TYPES = [
  { value: 'WEB', label: 'Website' },
  { value: 'MOBILE', label: 'Mobile App' },
]

const schema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Maximum 100 characters'),
  productType: z.enum(['WEB', 'MOBILE'], {
    message: 'Please select a product type',
  }),
  description: z.string().min(50, 'At least 50 characters').max(2000, 'Maximum 2000 characters'),
  reference: z.string()
    .max(500, 'Maximum 500 characters')
    .refine(val => !val || /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(val), {
      message: 'Invalid URL format. Must start with http:// or https://',
    })
    .optional()
    .or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function ProjectForm() {
  const router = useRouter()
  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { name: '', productType: '' as any, description: '', reference: '' }
    })

  const descriptionLength = watch('description')?.length ?? 0

  const onSubmit = async (data: FormValues) => {
    const result = await submitProjectAction({ ...data, reference: data.reference || undefined })
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Dự án đã được gửi.')
    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white border border-gray-200/80 rounded-xl p-6 md:p-8 shadow-sm">
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-gray-700 block" htmlFor="name">
          Project Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g. TBA Agentic Platform"
          {...register('name')}
          className="focus-visible:ring-teal-500 focus-visible:border-teal-500 w-full"
        />
        {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-gray-700 block">
          Product Type <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="productType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="focus:ring-teal-500 focus:border-teal-500 w-full">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_TYPES.map(pt => (
                  <SelectItem key={pt.value} value={pt.value}>
                    {pt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.productType && <p className="text-xs text-red-500 font-medium mt-1">{errors.productType.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-gray-700 block" htmlFor="description">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your project requirements in detail (min 50 characters)..."
          rows={6}
          {...register('description')}
          className="focus-visible:ring-teal-500 focus-visible:border-teal-500 w-full resize-none"
        />
        <div className="flex justify-between items-center mt-1">
          <div className="min-h-[1.25rem]">
            {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
          </div>
          <span className={`text-xs ${descriptionLength > 2000 ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
            {descriptionLength}/2000
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-gray-700 block" htmlFor="reference">
          Reference URL <span className="text-gray-400 font-normal">(optional)</span>
        </Label>
        <Input
          id="reference"
          type="url"
          placeholder="https://..."
          {...register('reference')}
          className="focus-visible:ring-teal-500 focus-visible:border-teal-500 w-full"
        />
        {errors.reference && <p className="text-xs text-red-500 font-medium mt-1">{errors.reference.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 transition-colors shadow-sm"
      >
        {isSubmitting ? 'Đang gửi…' : 'Submit Project'}
      </Button>
    </form>
  )
}
