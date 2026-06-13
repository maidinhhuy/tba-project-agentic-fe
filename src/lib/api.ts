const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8080'

type FetchOptions = RequestInit & {
  params?: Record<string, string | number>
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
  cookie?: string
): Promise<T> {
  const { params, ...init } = options

  let url = `${API_BASE}${path}`
  if (params) {
    const qs = new URLSearchParams(Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ))
    url += `?${qs.toString()}`
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(cookie ? { Cookie: cookie } : {}),
    ...init.headers,
  }

  const res = await fetch(url, { ...init, headers })

  if (res.status === 401) {
    // Caller (Server Component/Action) must handle redirect to /login
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.message ?? 'Request failed', body.error)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
