import Link from 'next/link'
import ProjectForm from './_components/ProjectForm'

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl mx-auto py-4">
      <div className="mb-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
          My Projects
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2 tracking-tight">Submit a New Project</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Fill in the details below and we’ll get back to you within 1 business day.
        </p>
      </div>
      <ProjectForm />
    </div>
  )
}
