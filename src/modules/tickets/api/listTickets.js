import { apiClient } from '@/shared/http/apiClient'

export function listTickets(params = {}) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    searchParams.set(key, value)
  })

  const queryString = searchParams.toString()
  const path = queryString ? `/tickets?${queryString}` : '/tickets'

  return apiClient(path)
}
