export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-sm font-medium text-teal-600 dark:text-teal-400 uppercase tracking-widest">
            CI/CD Live
          </span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          TBA Agentic FE
        </h1>

        <p className="max-w-sm text-zinc-500 dark:text-zinc-400">
          Deploy preview đang hoạt động. Mỗi push lên{" "}
          <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-sm font-mono dark:bg-zinc-800">
            dev
          </code>{" "}
          sẽ tự động deploy lên Vercel.
        </p>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white px-8 py-6 dark:border-zinc-800 dark:bg-zinc-900">
          <dl className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <div>
              <dt className="text-zinc-400">Branch</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">dev</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Status</dt>
              <dd className="font-medium text-teal-500">✓ Passed</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Package manager</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">pnpm</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Platform</dt>
              <dd className="font-medium text-zinc-900 dark:text-zinc-50">Vercel</dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
