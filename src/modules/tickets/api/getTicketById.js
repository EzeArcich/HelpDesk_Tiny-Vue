import { apiClient } from '@/shared/http/apiClient'

export function getTicketById(id) {
  return apiClient(`/tickets/${id}`)
}
