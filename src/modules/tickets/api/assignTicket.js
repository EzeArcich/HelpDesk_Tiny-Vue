import { apiClient } from '@/shared/http/apiClient'

export function assignTicket(id, assigneeId) {
  return apiClient(`/tickets/${id}/assign`, {
    method: 'POST',
    body: {
      assignee_id: assigneeId || null,
    },
  })
}
