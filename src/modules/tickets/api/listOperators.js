import { apiClient } from '@/shared/http/apiClient'

export function listOperators() {
  return apiClient('/operators')
}
