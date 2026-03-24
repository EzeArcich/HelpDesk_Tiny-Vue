import { buildApiUrl, env } from '@/config/env'

export async function apiClient(path, options = {}) {
  const { headers, body, ...restOptions } = options

  const requestHeaders = new Headers(headers || {})
  requestHeaders.set('Accept', 'application/json')

  const hasJsonBody = body && !(body instanceof FormData)
  if (hasJsonBody && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  if (env.useBearerAuth) {
    const token = localStorage.getItem('helpdesk_token')
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`)
    }
  }

  const response = await fetch(buildApiUrl(path), {
    ...restOptions,
    headers: requestHeaders,
    body: hasJsonBody ? JSON.stringify(body) : body,
  })

  const isJsonResponse = response.headers.get('content-type')?.includes('application/json')
  const payload = isJsonResponse ? await response.json() : await response.text()

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`)
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}
