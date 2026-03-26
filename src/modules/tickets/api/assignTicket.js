import { apiClient } from "@/shared/http/apiClient";

export function assignTicket(id, assigneId) {
    return apiClient('/tickets/${id}/assign', {
        method: 'POST',
        body: {
            assignee_id: assigneId || null,
        },
    })
}