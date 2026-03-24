<template>
  <section class="tickets-page">
    <header class="tickets-page__hero">
      <div class="tickets-page__hero-copy">
        <p class="tickets-page__eyebrow">Tickets</p>
        <h1 class="tickets-page__title">Mesa operativa</h1>
        <p class="tickets-page__description">
          Centralizá seguimiento, asignaciones y estados desde una vista pensada para trabajar
          rápido, sin salir del flujo.
        </p>
      </div>

      <div class="tickets-page__hero-actions">
        <span class="tickets-page__meta">MVP en construcción</span>
        <button type="button" class="tickets-page__button">
          Crear ticket
        </button>
      </div>
    </header>

    <section class="tickets-page__filters-card">
      <div class="tickets-page__section-head">
        <div>
          <p class="tickets-page__section-label">Filtrado</p>
          <h2 class="tickets-page__section-title">Refiná la bandeja</h2>
          <p class="tickets-page__section-text">
            Usá búsqueda, estado y agente para reducir el listado antes de conectar la API.
          </p>
        </div>

        <button
          type="button"
          class="tickets-page__ghost-button"
          :disabled="!activeFiltersCount"
          @click="resetFilters"
        >
          Limpiar filtros
        </button>
      </div>

      <form class="tickets-filters">
        <div class="tickets-filters__field tickets-filters__field--search">
          <label class="tickets-filters__label" for="search">
            Buscar ticket
          </label>
          <input
            id="search"
            v-model="filters.q"
            type="text"
            class="tickets-filters__input"
            placeholder="Asunto, descripción o referencia"
          />
        </div>

        <div class="tickets-filters__field">
          <label class="tickets-filters__label" for="status">
            Estado
          </label>
          <select id="status" v-model="filters.status" class="tickets-filters__input">
            <option value="">Todos</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div class="tickets-filters__field">
          <label class="tickets-filters__label" for="assignee">
            Agente
          </label>
          <select id="assignee" v-model="filters.assignee_id" class="tickets-filters__input">
            <option value="">Todos</option>
            <option value="1">Agente 1</option>
            <option value="2">Agente 2</option>
          </select>
        </div>
      </form>

      <div class="tickets-page__filters-footer">
        <div v-if="activeFiltersCount" class="tickets-page__active-filters">
          <p class="tickets-page__active-filters-label">
            Filtros activos ({{ activeFiltersCount }})
          </p>

          <div class="tickets-page__chips">
            <button
              v-for="filter in activeFilters"
              :key="filter.key"
              type="button"
              class="tickets-page__chip"
              @click="clearFilter(filter.key)"
            >
              <span>{{ filter.label }}</span>
              <span class="tickets-page__chip-close" aria-hidden="true">x</span>
            </button>
          </div>
        </div>

        <p v-else class="tickets-page__no-filters">
          Sin filtros activos. La URL refleja siempre el estado actual del listado.
        </p>
      </div>
    </section>

    <section class="tickets-page__results-card">
      <div class="tickets-page__results-head">
        <div>
          <p class="tickets-page__section-label">Resultados</p>
          <h2 class="tickets-page__section-title">Bandeja de tickets</h2>
          <p class="tickets-page__section-text">
            El listado ya consume `GET /api/tickets` usando la querystring actual.
          </p>
        </div>

        <div class="tickets-page__results-summary">
          <span class="tickets-page__results-meta">{{ ticketsCountLabel }}</span>
          <span class="tickets-page__results-hint">{{ resultsHint }}</span>
        </div>
      </div>

      <div v-if="isLoading" class="tickets-page__feedback-state">
        <div class="tickets-page__feedback-spinner" aria-hidden="true"></div>
        <div>
          <h3 class="tickets-page__feedback-title">Cargando tickets</h3>
          <p class="tickets-page__feedback-text">
            Consultando el backend con los filtros activos.
          </p>
        </div>
      </div>

      <div v-else-if="errorMessage" class="tickets-page__feedback-state tickets-page__feedback-state--error">
        <div class="tickets-page__feedback-icon" aria-hidden="true">!</div>
        <div>
          <h3 class="tickets-page__feedback-title">No pudimos cargar la bandeja</h3>
          <p class="tickets-page__feedback-text">{{ errorMessage }}</p>
        </div>
      </div>

      <div v-else-if="tickets.length" class="tickets-table">
        <article
          v-for="ticket in tickets"
          :key="ticket.id"
          class="tickets-table__row"
        >
          <div class="tickets-table__content">
            <div class="tickets-table__main">
              <div class="tickets-table__title-row">
                <h3 class="tickets-table__title">
                  {{ ticket.subject || `Ticket #${ticket.id}` }}
                </h3>

                <div class="tickets-table__badges">
                  <span
                    class="tickets-table__status"
                    :class="`tickets-table__status--${ticket.status || 'unknown'}`"
                  >
                    {{ formatStatus(ticket.status) }}
                  </span>

                  <span
                    class="tickets-table__priority"
                    :class="`tickets-table__priority--${ticket.priority || 'unknown'}`"
                  >
                    {{ formatPriority(ticket.priority) }}
                  </span>
                </div>
              </div>

              <p class="tickets-table__description">
                {{ ticket.description || 'Sin descripción disponible.' }}
              </p>

              <div class="tickets-table__requester">
                <span class="tickets-table__requester-label">Solicitante</span>
                <div class="tickets-table__requester-body">
                  <strong>{{ ticket.requester?.name || 'Sin nombre' }}</strong>
                  <span>{{ ticket.requester?.email || 'Sin email' }}</span>
                </div>
              </div>

              <div v-if="ticket.tags?.length" class="tickets-table__tags">
                <span
                  v-for="tag in ticket.tags"
                  :key="tag.id"
                  class="tickets-table__tag"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>

            <dl class="tickets-table__meta">
              <div>
                <dt>ID</dt>
                <dd>#{{ ticket.id }}</dd>
              </div>

              <div>
                <dt>Asignado</dt>
                <dd>{{ ticket.assignee?.name || ticket.assignee_id || 'Sin asignar' }}</dd>
              </div>

              <div>
                <dt>Actualizado</dt>
                <dd>{{ formatDate(ticket.updated_at || ticket.created_at) }}</dd>
              </div>
            </dl>
          </div>
        </article>

        <div v-if="paginationLinks.length" class="tickets-page__pagination">
          <div class="tickets-page__pagination-info">
            <span class="tickets-page__pagination-meta">
              Página {{ currentPage }} de {{ lastPage }}
            </span>
            <span v-if="pagination.total" class="tickets-page__pagination-meta">
              Total: {{ pagination.total }}
            </span>
          </div>

          <div class="tickets-page__pagination-controls">
            <template v-for="(link, index) in paginationLinks" :key="`${link.label}-${index}`">
              <span
                v-if="isPaginationEllipsis(link)"
                class="tickets-page__pagination-ellipsis"
                aria-hidden="true"
              >
                ...
              </span>

              <button
                v-else
                type="button"
                class="tickets-page__pagination-button"
                :class="{ 'tickets-page__pagination-button--active': link.active }"
                :disabled="!link.url"
                @click="goToPaginationLink(link)"
              >
                {{ getPaginationLabel(link) }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <div v-else class="tickets-page__empty-state">
        <div class="tickets-page__empty-icon" aria-hidden="true">TK</div>

        <div class="tickets-page__empty-copy">
          <h3 class="tickets-page__empty-title">No hay tickets para mostrar</h3>
          <p class="tickets-page__empty-text">
            Probá ajustando los filtros o verificá si el backend devolvió resultados para esta combinación.
          </p>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listTickets } from '@/modules/tickets/api/listTickets'

const route = useRoute()
const router = useRouter()
const tickets = ref([])
const pagination = ref({})
const isLoading = ref(false)
const errorMessage = ref('')

function normalizeQueryValue(value) {
  return typeof value === 'string' ? value : ''
}

const filters = reactive({
  q: normalizeQueryValue(route.query.q),
  status: normalizeQueryValue(route.query.status),
  assignee_id: normalizeQueryValue(route.query.assignee_id),
  page: normalizeQueryValue(route.query.page) || '1',
})

function resetFilters() {
  filters.q = ''
  filters.status = ''
  filters.assignee_id = ''
  filters.page = '1'
}

function clearFilter(key) {
  filters[key] = ''
  filters.page = '1'
}

function formatDate(value) {
  if (!value) return 'N/D'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function formatStatus(value) {
  if (!value) return 'Sin estado'

  const labels = {
    open: 'Open',
    in_progress: 'In progress',
    closed: 'Closed',
  }

  return labels[value] || value
}

function formatPriority(value) {
  if (!value) return 'Sin prioridad'

  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  }

  return labels[value] || value
}

function extractTicketsResponse(payload) {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      meta: {},
    }
  }

  if (Array.isArray(payload?.data)) {
    return {
      items: payload.data,
      meta: payload.meta || {},
    }
  }

  return {
    items: [],
    meta: {},
  }
}

const activeFilters = computed(() => {
  const items = []

  if (filters.q) {
    items.push({
      key: 'q',
      label: `Busqueda: ${filters.q}`,
    })
  }

  if (filters.status) {
    items.push({
      key: 'status',
      label: `Estado: ${filters.status}`,
    })
  }

  if (filters.assignee_id) {
    items.push({
      key: 'assignee_id',
      label: `Agente: ${filters.assignee_id}`,
    })
  }

  return items
})

const activeFiltersCount = computed(() => activeFilters.value.length)
const ticketsCountLabel = computed(() => `${tickets.value.length} tickets`)
const resultsHint = computed(() => {
  if (isLoading.value) return 'Sincronizando con backend'
  if (errorMessage.value) return 'Error de carga'
  if (pagination.value.total) return `${pagination.value.total} totales`
  if (tickets.value.length) return 'Resultados cargados'
  return 'Sin resultados'
})

const currentPage = computed(() => Number(pagination.value.current_page || filters.page || 1))
const lastPage = computed(() => Number(pagination.value.last_page || 1))
const paginationLinks = computed(() => pagination.value.links || [])

function getPaginationLabel(link) {
  if (link.label.includes('Previous')) return 'Anterior'
  if (link.label.includes('Next')) return 'Siguiente'
  return link.label
}

function isPaginationEllipsis(link) {
  return !link.url && !link.page && link.label === '...'
}

function goToPaginationLink(link) {
  if (!link.url || !link.page) return
  filters.page = String(link.page)
}

async function fetchTickets() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const payload = await listTickets({
      q: normalizeQueryValue(route.query.q),
      status: normalizeQueryValue(route.query.status),
      assignee_id: normalizeQueryValue(route.query.assignee_id),
      page: normalizeQueryValue(route.query.page),
    })

    const { items, meta } = extractTicketsResponse(payload)
    tickets.value = items
    pagination.value = meta
  } catch (error) {
    tickets.value = []
    pagination.value = {}
    errorMessage.value =
      error?.payload?.message ||
      'Revisá la URL base de la API, CORS o la disponibilidad del endpoint /api/tickets.'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.query,
  (query) => {
    filters.q = normalizeQueryValue(query.q)
    filters.status = normalizeQueryValue(query.status)
    filters.assignee_id = normalizeQueryValue(query.assignee_id)
    filters.page = normalizeQueryValue(query.page) || '1'
    fetchTickets()
  },
  { immediate: true }
)

let lastNonPageFiltersSnapshot = ''

watch(
  filters,
  () => {
    const currentNonPageSnapshot = JSON.stringify({
      q: filters.q,
      status: filters.status,
      assignee_id: filters.assignee_id,
    })

    if (lastNonPageFiltersSnapshot && lastNonPageFiltersSnapshot !== currentNonPageSnapshot) {
      filters.page = '1'
    }

    lastNonPageFiltersSnapshot = currentNonPageSnapshot

    const nextQuery = {
      q: filters.q || undefined,
      status: filters.status || undefined,
      assignee_id: filters.assignee_id || undefined,
      page: filters.page && filters.page !== '1' ? filters.page : undefined,
    }

    const currentQuery = {
      q: normalizeQueryValue(route.query.q) || undefined,
      status: normalizeQueryValue(route.query.status) || undefined,
      assignee_id: normalizeQueryValue(route.query.assignee_id) || undefined,
      page: normalizeQueryValue(route.query.page) || undefined,
    }

    const isSameQuery =
      nextQuery.q === currentQuery.q &&
      nextQuery.status === currentQuery.status &&
      nextQuery.assignee_id === currentQuery.assignee_id &&
      nextQuery.page === currentQuery.page

    if (isSameQuery) return

    router.replace({
      query: nextQuery,
    })
  },
  { deep: true }
)
</script>

<style scoped>
.tickets-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tickets-page__hero,
.tickets-page__filters-card,
.tickets-page__results-card {
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.tickets-page__hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 28px;
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 30%),
    rgba(255, 255, 255, 0.82);
}

.tickets-page__hero-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tickets-page__eyebrow {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary-strong);
}

.tickets-page__title {
  margin: 0;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-text);
}

.tickets-page__description {
  margin: 0;
  max-width: 760px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.tickets-page__hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.tickets-page__meta {
  display: inline-flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 700;
}

.tickets-page__button {
  border: 0;
  border-radius: 999px;
  padding: 11px 16px;
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-strong) 100%);
  color: white;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(2, 132, 199, 0.18);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tickets-page__button:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(2, 132, 199, 0.22);
}

.tickets-page__filters-card,
.tickets-page__results-card {
  padding: 24px;
}

.tickets-page__section-head,
.tickets-page__results-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.tickets-page__section-head {
  margin-bottom: 20px;
}

.tickets-page__section-label {
  margin: 0 0 8px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-primary-strong);
}

.tickets-page__section-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.tickets-page__section-text {
  margin: 10px 0 0;
  max-width: 620px;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.tickets-page__ghost-button {
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-text);
  border-radius: 999px;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;
}

.tickets-page__ghost-button:hover:not(:disabled) {
  background: var(--color-surface-muted);
  border-color: rgba(14, 165, 233, 0.24);
}

.tickets-page__ghost-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.tickets-filters {
  display: grid;
  grid-template-columns: minmax(0, 2fr) repeat(2, minmax(180px, 1fr));
  gap: 16px;
}

.tickets-filters__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tickets-filters__label {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--color-text);
}

.tickets-filters__input {
  width: 100%;
  min-height: 48px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 0 14px;
  background: white;
  color: var(--color-text);
  font: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.tickets-filters__input::placeholder {
  color: #94a3b8;
}

.tickets-filters__input:focus {
  border-color: rgba(14, 165, 233, 0.55);
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
}

.tickets-page__filters-footer {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid rgba(215, 224, 234, 0.7);
}

.tickets-page__active-filters {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tickets-page__active-filters-label {
  margin: 0;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--color-text-muted);
}

.tickets-page__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tickets-page__chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.16);
  color: var(--color-primary-strong);
  font-size: 0.84rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.tickets-page__chip-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: rgba(2, 132, 199, 0.14);
  font-size: 0.75rem;
  line-height: 1;
}

.tickets-page__no-filters {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
}

.tickets-page__results-head {
  margin-bottom: 24px;
}

.tickets-page__results-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.tickets-page__results-meta {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 700;
}

.tickets-page__results-hint {
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.tickets-page__empty-state {
  display: flex;
  align-items: center;
  gap: 18px;
  border: 1px dashed rgba(71, 85, 105, 0.25);
  border-radius: 18px;
  padding: 28px;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.9), rgba(248, 250, 252, 0.72));
}

.tickets-page__feedback-state {
  display: flex;
  align-items: center;
  gap: 18px;
  border-radius: 18px;
  padding: 24px;
  background: rgba(248, 250, 252, 0.72);
  border: 1px solid rgba(215, 224, 234, 0.9);
}

.tickets-page__feedback-state--error {
  background: rgba(254, 242, 242, 0.9);
  border-color: rgba(248, 113, 113, 0.28);
}

.tickets-page__feedback-spinner,
.tickets-page__feedback-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  flex-shrink: 0;
}

.tickets-page__feedback-spinner {
  border: 3px solid rgba(14, 165, 233, 0.16);
  border-top-color: var(--color-primary);
  animation: tickets-spin 0.8s linear infinite;
}

.tickets-page__feedback-icon {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  font-size: 1.2rem;
  font-weight: 800;
}

.tickets-page__feedback-title {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 800;
}

.tickets-page__feedback-text {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.tickets-table {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tickets-table__row {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(215, 224, 234, 0.9);
  background: rgba(248, 250, 252, 0.75);
}

.tickets-table__content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.tickets-table__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tickets-table__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.tickets-table__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.tickets-table__badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tickets-table__status {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tickets-table__status--open {
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.18);
  color: var(--color-primary-strong);
}

.tickets-table__status--in_progress {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.22);
  color: #b45309;
}

.tickets-table__status--closed {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #047857;
}

.tickets-table__status--unknown {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #475569;
}

.tickets-table__priority {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tickets-table__priority--low {
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: #475569;
}

.tickets-table__priority--medium {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.18);
  color: #1d4ed8;
}

.tickets-table__priority--high {
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.18);
  color: #c2410c;
}

.tickets-table__priority--urgent {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.tickets-table__priority--unknown {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #475569;
}

.tickets-table__description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.7;
}

.tickets-table__requester {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tickets-table__requester-label {
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.tickets-table__requester-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tickets-table__requester-body strong {
  font-size: 0.95rem;
}

.tickets-table__requester-body span {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.tickets-table__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tickets-table__tag {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(215, 224, 234, 0.95);
  color: var(--color-text-muted);
  font-size: 0.8rem;
  font-weight: 700;
}

.tickets-table__meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, auto));
  gap: 16px;
  margin: 0;
  flex-shrink: 0;
}

.tickets-table__meta dt {
  margin: 0 0 6px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.tickets-table__meta dd {
  margin: 0;
  font-weight: 700;
  color: var(--color-text);
}

.tickets-page__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(215, 224, 234, 0.7);
}

.tickets-page__pagination-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tickets-page__pagination-meta {
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.tickets-page__pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tickets-page__pagination-button {
  min-width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: white;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0 12px;
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}

.tickets-page__pagination-button:hover:not(:disabled) {
  border-color: rgba(14, 165, 233, 0.3);
  background: rgba(14, 165, 233, 0.06);
}

.tickets-page__pagination-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tickets-page__pagination-button--active {
  background: linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-strong) 100%);
  border-color: transparent;
  color: white;
}

.tickets-page__pagination-ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  color: var(--color-text-muted);
  font-weight: 700;
}

.tickets-page__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.16), rgba(14, 165, 233, 0.08));
  color: var(--color-primary-strong);
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.tickets-page__empty-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tickets-page__empty-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
}

.tickets-page__empty-text {
  margin: 0;
  max-width: 720px;
  color: var(--color-text-muted);
  line-height: 1.7;
}

@media (max-width: 980px) {
  .tickets-page__hero,
  .tickets-page__section-head,
  .tickets-page__results-head {
    flex-direction: column;
    align-items: stretch;
  }

  .tickets-page__hero-actions {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .tickets-filters {
    grid-template-columns: 1fr;
  }

  .tickets-page__results-summary {
    align-items: flex-start;
  }

  .tickets-table__row {
    flex-direction: column;
  }

  .tickets-table__content {
    flex-direction: column;
  }

  .tickets-table__meta {
    grid-template-columns: 1fr;
  }

  .tickets-page__empty-state {
    flex-direction: column;
    align-items: flex-start;
  }

  .tickets-page__pagination {
    flex-direction: column;
    align-items: stretch;
  }

  .tickets-page__pagination-controls {
    justify-content: flex-start;
  }

}

@keyframes tickets-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
