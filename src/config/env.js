const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
const apiPrefix = (import.meta.env.VITE_API_PREFIX || '/api').replace(/\/$/, '')
const useBearerAuth = import.meta.env.VITE_USE_BEARER_AUTH === 'true'

export const env = {
  apiBaseUrl,
  apiPrefix,
  useBearerAuth,
}

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${env.apiBaseUrl}${env.apiPrefix}${normalizedPath}`
}
