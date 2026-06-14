'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Bold,
  Italic,
  Heading,
  Link as LinkIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Eye,
  Edit2
} from 'lucide-react'
import { submitProjectAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MarkdownPreview } from '@/components/MarkdownPreview'

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
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { name: '', productType: '' as any, description: '', reference: '' }
    })

  const descriptionLength = watch('description')?.length ?? 0
  const descriptionValue = watch('description') ?? ''

  const onSubmit = async (data: FormValues) => {
    const result = await submitProjectAction({ ...data, reference: data.reference || undefined })
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success('Dự án đã được gửi.')
    router.push('/')
  }

  const handleInsertMarkdown = (syntaxBefore: string, syntaxAfter: string = '') => {
    const textarea = document.getElementById('description') as HTMLTextAreaElement
    if (!textarea) return
    
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const selectedText = text.substring(start, end)
    const replacement = syntaxBefore + selectedText + syntaxAfter
    
    const newValue = text.substring(0, start) + replacement + text.substring(end)
    setValue('description', newValue, { shouldValidate: true })
    
    // Refocus and set cursor
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + syntaxBefore.length,
        start + syntaxBefore.length + selectedText.length
      )
    }, 0)
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
        <div className="flex justify-between items-center mb-1">
          <Label className="text-sm font-semibold text-gray-700 block" htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-lg border border-gray-200/60 dark:border-gray-700/60 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-xs border border-gray-200/30'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-xs border border-gray-200/30'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Eye className="h-3 w-3" />
              Preview
            </button>
          </div>
        </div>

        {activeTab === 'write' ? (
          <div className="space-y-0.5">
            {/* Markdown Toolbar */}
            <div className="flex flex-wrap items-center gap-1 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-t-lg px-2 py-1.5">
              <button
                type="button"
                title="Bold"
                onClick={() => handleInsertMarkdown('**', '**')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Bold className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Italic"
                onClick={() => handleInsertMarkdown('*', '*')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Italic className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Heading"
                onClick={() => handleInsertMarkdown('### ', '')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Heading className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Link"
                onClick={() => handleInsertMarkdown('[', '](url)')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <LinkIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Code"
                onClick={() => handleInsertMarkdown('`', '`')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Code className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Unordered List"
                onClick={() => handleInsertMarkdown('- ', '')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <List className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Ordered List"
                onClick={() => handleInsertMarkdown('1. ', '')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ListOrdered className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                title="Blockquote"
                onClick={() => handleInsertMarkdown('> ', '')}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Quote className="h-3.5 w-3.5" />
              </button>
            </div>
            <Textarea
              id="description"
              placeholder="Describe your project requirements in detail (min 50 characters, supports markdown)..."
              rows={8}
              {...register('description')}
              className="focus-visible:ring-teal-500 focus-visible:border-teal-500 w-full resize-none rounded-t-none border-t-0"
            />
          </div>
        ) : (
          <div className="bg-gray-50/50 dark:bg-gray-800/10 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[14rem] max-h-[24rem] overflow-y-auto">
            {descriptionValue ? (
              <MarkdownPreview content={descriptionValue} />
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                Nothing to preview yet. Write some markdown in the Edit tab.
              </p>
            )}
          </div>
        )}

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
