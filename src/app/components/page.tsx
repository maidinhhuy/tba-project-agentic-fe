'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Bell,
  CircleAlert,
  Download,
  MoreHorizontal,
  Save,
  Search,
  Settings,
  Trash2,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { ProjectCard as DashboardProjectCard } from '@/components/ProjectCard'
import { ProjectCard as CompactProjectCard } from '@/components/project-card'
import { StatusBadge } from '@/components/status-badge'

const statuses = [
  'SUBMITTED',
  'ANALYZING',
  'IN_DEVELOPMENT',
  'AWAITING_REVIEW',
  'IN_REVISION',
  'FINALIZING',
  'DELIVERED',
  'CANCELLED',
]

type DemoFormValues = {
  projectName: string
  projectType: string
  brief: string
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-b border-gray-200 py-8 last:border-b-0">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-gray-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export default function ComponentsPage() {
  const form = useForm<DemoFormValues>({
    defaultValues: {
      projectName: 'TBA Website Refresh',
      projectType: 'Website',
      brief: 'Build a polished handoff experience for customer projects.',
    },
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 border-b bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-teal-700">
            TBA
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild size="sm" className="bg-teal-600 text-white hover:bg-teal-700">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="border-b border-gray-200 pb-8">
          <p className="text-sm font-medium text-teal-700">Public component gallery</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
            TBA Component Library
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-500">
            A public page to quickly test the visual state of the components present in the
            codebase.
          </p>
        </header>

        <Section title="Buttons" description="Variants, sizes, icon buttons, and disabled state.">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">
              <Trash2 />
              Delete
            </Button>
            <Button variant="link">Link button</Button>
            <Button size="sm">
              <Save />
              Save
            </Button>
            <Button size="lg">
              <Download />
              Export
            </Button>
            <Button size="icon" aria-label="Settings">
              <Settings />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </Section>

        <Section title="Badges And Statuses" description="Generic badges plus project status tokens.">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
            <div className="flex flex-wrap gap-3">
              {statuses.map(status => (
                <StatusBadge key={status} status={status} />
              ))}
            </div>
          </div>
        </Section>

        <Section title="Form Controls" description="Labels, inputs, textarea, select, and form helpers.">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="component-search">Search input</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input id="component-search" className="pl-9" placeholder="Search projects" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="component-brief">Textarea</Label>
                <Textarea id="component-brief" placeholder="Project brief" />
              </div>
              <div className="space-y-2">
                <Label>Native select wrapper</Label>
                <Select defaultValue="website">
                  <SelectTrigger>
                    <SelectValue placeholder="Choose product type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="mobile-app">Mobile app</SelectItem>
                    <SelectItem value="automation">Automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(() => toast.success('Form submitted'))}
                className="space-y-4 rounded-lg border bg-white p-5"
              >
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Displayed in project cards and review screens.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brief"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brief</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit demo form</Button>
              </form>
            </Form>
          </div>
        </Section>

        <Section title="Overlays And Menus" description="Dropdown menu, dialog, and toast trigger.">
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <MoreHorizontal />
                  Open menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Project actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Edit
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuCheckboxItem checked>
                  Receive notifications
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value="customer">
                  <DropdownMenuRadioItem value="customer">Customer view</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="admin">Admin view</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Bell />
                  Open dialog
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm project update</DialogTitle>
                  <DialogDescription>
                    This demo dialog shows the shared modal layout and footer actions.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="secondary" onClick={() => toast.info('Toast component is mounted')}>
              Trigger toast
            </Button>
          </div>
        </Section>

        <Section title="Cards, Alerts, Tables, Skeletons">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card title</CardTitle>
                  <CardDescription>Reusable card shell with header, content, and footer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Use this for repeated records or compact framed content.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Secondary action</Button>
                </CardFooter>
              </Card>

              <Alert>
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Default alert</AlertTitle>
                <AlertDescription>Useful for neutral information and confirmation copy.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <CircleAlert className="h-4 w-4" />
                <AlertTitle>Destructive alert</AlertTitle>
                <AlertDescription>Use this for errors or high-risk states.</AlertDescription>
              </Alert>
            </div>

            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Button</TableCell>
                    <TableCell>Ready</TableCell>
                    <TableCell className="text-right">6</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Project cards</TableCell>
                    <TableCell>Ready</TableCell>
                    <TableCell className="text-right">2</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="space-y-3 rounded-lg border bg-white p-5" aria-label="Skeleton demo">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section title="Project Components" description="Both exported project card variants.">
          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardProjectCard
              projectId="component-gallery"
              name="TBA Component Gallery"
              productType="Website"
              status="IN_DEVELOPMENT"
              revisionCount={2}
              createdAt="2026-06-01T09:00:00Z"
              updatedAt="2026-06-13T09:00:00Z"
            />
            <CompactProjectCard
              projectId="compact-component-gallery"
              name="Compact project card variant"
              productType="Automation"
              status="AWAITING_REVIEW"
              revisionCount={1}
              createdAt="2026-06-10T09:00:00Z"
            />
          </div>
        </Section>
      </div>
    </main>
  )
}
