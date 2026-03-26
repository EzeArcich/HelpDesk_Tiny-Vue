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
          <label class="tickets-filters__label" for="search">Buscar ticket</label>
          <input
            id="search"
            v-model="filters.q"
            type="text"
            class="tickets-filters__input"
            placeholder="Asunto, descripción o referencia"
          />
        </div>

        <div class="tickets-filters__field">
          <label class="tickets-filters__label" for="status">Estado</label>
          <select id="status" v-model="filters.status" class="tickets-filters__input">
            <option value="">Todos</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div class="tickets-filters__field">
          <label class="tickets-filters__label" for="assignee">Agente</label>
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

    <section class="tickets-page__results-card" :class="{ 'tickets-page__results-card--muted': isDetailOpen }">
      <div class="tickets-page__results-head">
        <div>
          <p class="tickets-page__section-label">Resultados</p>
          <h2 class="tickets-page__section-title">Bandeja de tickets</h2>
          <p class="tickets-page__section-text">
            El listado consume `GET /api/tickets` y el detalle se abre como panel lateral.
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

      <div
        v-else-if="errorMessage"
        class="tickets-page__feedback-state tickets-page__feedback-state--error"
      >
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
          :class="{ 'tickets-table__row--active': String(ticket.id) === selectedTicketId }"
          tabindex="0"
          role="button"
          @click="openTicketDetail(ticket.id)"
          @keyup.enter="openTicketDetail(ticket.id)"
        >
          <div class="tickets-table__topline">
            <div class="tickets-table__ticket-code">
              <span class="tickets-table__ticket-code-label">Ticket</span>
              <strong class="tickets-table__ticket-code-value">#{{ ticket.id }}</strong>
            </div>

            <div class="tickets-table__topline-meta">
              <span class="tickets-table__timestamp">
                Actualizado {{ formatDate(ticket.updated_at || ticket.created_at) }}
              </span>
            </div>
          </div>

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

              <div class="tickets-table__supporting">
                <div class="tickets-table__requester-card">
                  <span class="tickets-table__requester-kicker">Solicitante</span>
                  <div class="tickets-table__requester-body">
                    <strong>{{ ticket.requester?.name || 'Sin nombre' }}</strong>
                    <span>{{ ticket.requester?.email || 'Sin email' }}</span>
                  </div>
                </div>

                <div v-if="ticket.tags?.length" class="tickets-table__tags-card">
                  <span class="tickets-table__tags-kicker">Tags</span>
                  <div class="tickets-table__tags">
                    <span
                      v-for="tag in ticket.tags"
                      :key="tag.id"
                      class="tickets-table__tag"
                    >
                      {{ tag.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <dl class="tickets-table__meta-card">
              <div>
                <dt>Asignado</dt>
                <dd>{{ ticket.assignee?.name || ticket.assignee_id || 'Sin asignar' }}</dd>
              </div>

              <div>
                <dt>Creado</dt>
                <dd>{{ formatDate(ticket.created_at) }}</dd>
              </div>

              <div>
                <dt>Ultimo cambio</dt>
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

    <Teleport to="body">
      <Transition name="ticket-drawer">
        <div v-if="isDetailOpen" class="ticket-drawer">
          <button
            type="button"
            class="ticket-drawer__backdrop"
            aria-label="Cerrar detalle"
            @click="closeTicketDetail"
          ></button>

          <aside class="ticket-drawer__panel">
            <div class="ticket-drawer__glow" aria-hidden="true"></div>
            <svg
              class="ticket-drawer__outline"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect x="10" y="10" width="calc(100% - 20px)" height="calc(100% - 20px)" rx="24" ry="24"></rect>
            </svg>

            <header class="ticket-drawer__header">
              <div class="ticket-drawer__header-copy">
                <span class="ticket-drawer__eyebrow">Ticket seleccionado</span>
                <h2 class="ticket-drawer__title">
                  {{ detailTicket?.subject || `Ticket #${selectedTicketId}` }}
                </h2>
                <div v-if="detailTicket" class="ticket-drawer__badges">
                  <span
                    class="ticket-drawer__status"
                    :class="`ticket-drawer__status--${detailTicket.status || 'unknown'}`"
                  >
                    {{ formatStatus(detailTicket.status) }}
                  </span>
                  <span
                    class="ticket-drawer__priority"
                    :class="`ticket-drawer__priority--${detailTicket.priority || 'unknown'}`"
                  >
                    {{ formatPriority(detailTicket.priority) }}
                  </span>
                </div>
              </div>

              <button
                type="button"
                class="ticket-drawer__close"
                aria-label="Cerrar"
                @click="closeTicketDetail"
              >
                x
              </button>
            </header>

            <div class="ticket-drawer__body">
              <div v-if="isDetailLoading" class="ticket-drawer__state">
                <div class="ticket-drawer__spinner" aria-hidden="true"></div>
                <div>
                  <h3 class="ticket-drawer__state-title">Cargando detalle</h3>
                  <p class="ticket-drawer__state-text">
                    Trayendo datos completos del ticket seleccionado.
                  </p>
                </div>
              </div>

              <div
                v-else-if="detailErrorMessage"
                class="ticket-drawer__state ticket-drawer__state--error"
              >
                <div class="ticket-drawer__state-icon" aria-hidden="true">!</div>
                <div>
                  <h3 class="ticket-drawer__state-title">No pudimos abrir este ticket</h3>
                  <p class="ticket-drawer__state-text">{{ detailErrorMessage }}</p>
                </div>
              </div>

              <template v-else-if="detailTicket">
                <section class="ticket-drawer__section">
                  <div class="ticket-drawer__section-head">
                    <span class="ticket-drawer__section-kicker">Resumen</span>
                    <span class="ticket-drawer__ticket-id">#{{ detailTicket.id }}</span>
                  </div>
                  <p class="ticket-drawer__description">
                    {{ detailTicket.description || 'Sin descripción disponible.' }}
                  </p>
                </section>

                <section class="ticket-drawer__section">
                  <div class="ticket-drawer__section-head">
                    <span class="ticket-drawer__section-kicker">Gestion</span>
                  </div>

                  <div class="ticket-form-grid">
                    <label class="ticket-form-field" for="ticket-status">
                      <span>Estado</span>
                      <select id="ticket-status" v-model="ticketForm.status" class="tickets-filters__input">
                        <option value="">Seleccionar estado</option>
                        <option
                          v-for="option in statusOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </label>

                    <label class="ticket-form-field" for="ticket-assignee">
                      <span>Asignado</span>
                      <select id="ticket-assignee" v-model="ticketForm.assignee_id" class="tickets-filters__input">
                        <option value="">Sin asignar</option>
                        <option
                          v-for="option in assigneeOptions"
                          :key="option.id"
                          :value="String(option.id)"
                        >
                          {{ option.name }}
                        </option>
                      </select>
                    </label>
                  </div>
                </section>

                <section class="ticket-drawer__grid">
                  <article class="ticket-drawer__card">
                    <span class="ticket-drawer__card-kicker">Solicitante</span>
                    <strong>{{ detailTicket.requester?.name || 'Sin nombre' }}</strong>
                    <span>{{ detailTicket.requester?.email || 'Sin email' }}</span>
                  </article>

                  <article class="ticket-drawer__card">
                    <span class="ticket-drawer__card-kicker">Asignado</span>
                    <strong>{{ detailTicket.assignee?.name || detailTicket.assignee_id || 'Sin asignar' }}</strong>
                    <span>{{ detailTicket.assignee?.email || 'Sin contacto disponible' }}</span>
                  </article>
                </section>

                <section class="ticket-drawer__grid">
                  <article class="ticket-drawer__card">
                    <span class="ticket-drawer__card-kicker">Creado</span>
                    <strong>{{ formatDate(detailTicket.created_at) }}</strong>
                  </article>

                  <article class="ticket-drawer__card">
                    <span class="ticket-drawer__card-kicker">Ultimo cambio</span>
                    <strong>{{ formatDate(detailTicket.updated_at || detailTicket.created_at) }}</strong>
                  </article>
                </section>

                <section v-if="detailTicket.tags?.length" class="ticket-drawer__section">
                  <div class="ticket-drawer__section-head">
                    <span class="ticket-drawer__section-kicker">Tags</span>
                  </div>
                  <div class="ticket-drawer__tags">
                    <span
                      v-for="tag in detailTicket.tags"
                      :key="tag.id"
                      class="ticket-drawer__tag"
                    >
                      {{ tag.name }}
                    </span>
                  </div>
                </section>

                <section class="ticket-drawer__section">
                  <div class="ticket-drawer__section-head">
                    <span class="ticket-drawer__section-kicker">Comentarios</span>
                    <span class="ticket-drawer__section-meta">
                      {{ ticketComments.length }} items
                    </span>
                  </div>

                  <div v-if="ticketComments.length" class="ticket-drawer__comments">
                    <article
                      v-for="comment in ticketComments"
                      :key="comment.id || comment.created_at || comment.body"
                      class="ticket-drawer__comment"
                    >
                      <div class="ticket-drawer__comment-topline">
                        <strong>{{ comment.author?.name || comment.user?.name || 'Equipo HelpDesk' }}</strong>
                        <span>{{ comment.visibility || 'public' }}</span>
                      </div>
                      <p>{{ comment.body || comment.content || comment.message || 'Sin contenido.' }}</p>
                    </article>
                  </div>

                  <div v-else class="ticket-drawer__empty-comments">
                    Todavía no hay comentarios asociados a este ticket.
                  </div>
                </section>
              </template>

            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTicketById } from '@/modules/tickets/api/getTicketById'
import { listTickets } from '@/modules/tickets/api/listTickets'

const route = useRoute()
const router = useRouter()

const tickets = ref([])
const pagination = ref({})
const isLoading = ref(false)
const errorMessage = ref('')

const detailTicket = ref(null)
const isDetailLoading = ref(false)
const detailErrorMessage = ref('')
const ticketForm = reactive({
  status: '',
  assignee_id: '',
})
const statusOptions = [
  { value: 'open', label: 'Open'},
  { value: 'in_progress', label: 'In progress'},
  { value: 'closed', label: 'Closed'}
]

const assigneeOptions = computed (() => {
  if (Array.isArray(detailTicket.value?.assignee_options)) {
    return detailTicket.value.assignee_options
  }

    if (detailTicket.value?.assignee) {
    return [detailTicket.value.assignee]
  }

  return []
})

let lockedScrollY = 0

function normalizeQueryValue(value) {
  return typeof value === 'string' ? value : ''
}

const filters = reactive({
  q: normalizeQueryValue(route.query.q),
  status: normalizeQueryValue(route.query.status),
  assignee_id: normalizeQueryValue(route.query.assignee_id),
  page: normalizeQueryValue(route.query.page) || '1',
})

const selectedTicketId = computed(() =>
  typeof route.params.id === 'string' ? route.params.id : ''
)
const isDetailOpen = computed(() => Boolean(selectedTicketId.value))

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

function openTicketDetail(ticketId) {
  router.push({
    name: 'ticket.detail',
    params: { id: String(ticketId) },
    query: route.query,
  })
}

function closeTicketDetail() {
  router.push({
    name: 'tickets',
    query: route.query,
  })
}

function handleEscape(event) {
  if (event.key === 'Escape' && isDetailOpen.value) {
    closeTicketDetail()
  }
}

function lockBodyScroll() {
  lockedScrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${lockedScrollY}px`
  document.body.style.left = '0'
  document.body.style.right = '0'
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'
}

function unlockBodyScroll() {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.left = ''
  document.body.style.right = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  window.scrollTo({ top: lockedScrollY })
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
  unlockBodyScroll()
})

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
const ticketComments = computed(() => detailTicket.value?.comments || [])

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

function syncTicketForm(ticket) {
  ticketForm.status = ticket?.status || ''
  ticketForm.assignee_id = ticket?.assignee_id ? String(ticket.assignee_id) : ''
}


async function fetchTicketDetail(id) {
  if (!id) {
    detailTicket.value = null
    detailErrorMessage.value = ''
    syncTicketForm(null)
    return
  }

  isDetailLoading.value = true
  detailErrorMessage.value = ''

  try {
    detailTicket.value = await getTicketById(id)
    syncTicketForm(detailTicket.value)
  } catch (error) {
    detailTicket.value = null
    detailErrorMessage.value =
      error?.payload?.message || 'No pudimos recuperar el detalle de este ticket.'
  } finally {
    isDetailLoading.value = false
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

watch(
  selectedTicketId,
  (id) => {
    fetchTicketDetail(id)
  },
  { immediate: true }
)

watch(isDetailOpen, (open) => {
  if (open) {
    lockBodyScroll()
    return
  }

  unlockBodyScroll()
})

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
  position: relative;
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

.tickets-page__results-card--muted {
  transform: scale(0.992);
  opacity: 0.82;
  transition: transform 0.22s ease, opacity 0.22s ease;
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
  gap: 20px;
  padding: 22px;
  border-radius: 22px;
  border: 1px solid rgba(215, 224, 234, 0.95);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(248, 250, 252, 0.82));
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.05);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.tickets-table__row:hover,
.tickets-table__row:focus-visible,
.tickets-table__row--active {
  transform: translateY(-1px);
  border-color: rgba(14, 165, 233, 0.25);
  box-shadow: 0 22px 40px rgba(15, 23, 42, 0.08);
  outline: none;
}

.tickets-table__topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(215, 224, 234, 0.78);
}

.tickets-table__ticket-code {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.tickets-table__ticket-code-label {
  display: inline-flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tickets-table__ticket-code-value {
  font-size: 0.96rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.tickets-table__topline-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tickets-table__timestamp {
  font-size: 0.84rem;
  color: var(--color-text-muted);
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
  gap: 14px;
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
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.tickets-table__badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.tickets-table__status,
.tickets-table__priority,
.ticket-drawer__status,
.ticket-drawer__priority {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
}

.tickets-table__status--open,
.ticket-drawer__status--open {
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.18);
  color: var(--color-primary-strong);
}

.tickets-table__status--in_progress,
.ticket-drawer__status--in_progress {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.22);
  color: #b45309;
}

.tickets-table__status--closed,
.ticket-drawer__status--closed {
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #047857;
}

.tickets-table__status--unknown,
.ticket-drawer__status--unknown {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #475569;
}

.tickets-table__priority--low,
.ticket-drawer__priority--low {
  background: rgba(148, 163, 184, 0.12);
  border: 1px solid rgba(148, 163, 184, 0.18);
  color: #475569;
}

.tickets-table__priority--medium,
.ticket-drawer__priority--medium {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.18);
  color: #1d4ed8;
}

.tickets-table__priority--high,
.ticket-drawer__priority--high {
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.18);
  color: #c2410c;
}

.tickets-table__priority--urgent,
.ticket-drawer__priority--urgent {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.tickets-table__priority--unknown,
.ticket-drawer__priority--unknown {
  background: rgba(148, 163, 184, 0.16);
  border: 1px solid rgba(148, 163, 184, 0.22);
  color: #475569;
}

.tickets-table__description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.75;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tickets-table__supporting {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 14px;
}

.tickets-table__requester-card,
.tickets-table__tags-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 15px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.88);
  border: 1px solid rgba(215, 224, 234, 0.88);
}

.tickets-table__requester-kicker,
.tickets-table__tags-kicker,
.ticket-drawer__section-kicker,
.ticket-drawer__card-kicker {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary-strong);
}

.tickets-table__requester-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tickets-table__requester-body strong {
  font-size: 0.95rem;
}

.tickets-table__requester-body span {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.tickets-table__tags,
.ticket-drawer__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tickets-table__tag,
.ticket-drawer__tag {
  display: inline-flex;
  align-items: center;
  padding: 7px 11px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.08);
  border: 1px solid rgba(14, 165, 233, 0.14);
  color: var(--color-primary-strong);
  font-size: 0.8rem;
  font-weight: 700;
}

.tickets-table__meta-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin: 0;
  min-width: 220px;
  flex-shrink: 0;
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.02));
  border: 1px solid rgba(215, 224, 234, 0.9);
}

.tickets-table__meta-card dt {
  margin: 0 0 6px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.tickets-table__meta-card dd {
  margin: 0;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.5;
}

.tickets-page__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
  padding-top: 16px;
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

.ticket-drawer {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  padding: 18px;
}

.ticket-drawer__backdrop {
  position: absolute;
  inset: 0;
  border: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.12), transparent 30%),
    rgba(15, 23, 42, 0.34);
}

.ticket-drawer__panel {
  position: relative;
  width: min(620px, calc(100vw - 36px));
  height: calc(100vh - 36px);
  margin-left: auto;
  background:
    linear-gradient(180deg, rgba(245, 249, 253, 0.98), rgba(236, 244, 251, 0.96));
  border: 1px solid rgba(215, 224, 234, 0.9);
  border-radius: 28px;
  box-shadow:
    0 28px 90px rgba(15, 23, 42, 0.22),
    0 8px 24px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform-origin: right center;
}

.ticket-drawer__glow {
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 320px;
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.26), transparent 50%),
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.14), transparent 38%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.04), transparent 70%);
  pointer-events: none;
}

.ticket-drawer__panel::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 35%, #60a5fa 100%);
}

.ticket-drawer__panel::after {
  content: "";
  position: absolute;
  inset: 72px 18px 18px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  pointer-events: none;
}

.ticket-drawer__outline {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}

.ticket-drawer__outline rect {
  fill: none;
  stroke: rgba(125, 211, 252, 0.95);
  stroke-width: 2;
  stroke-dasharray: 2600;
  stroke-dashoffset: 2600;
}

.ticket-drawer__header {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 24px 20px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.94), rgba(22, 32, 51, 0.9));
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.16);
}

.ticket-drawer__header-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.ticket-drawer__eyebrow {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7dd3fc;
}

.ticket-drawer__title {
  margin: 0;
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  max-width: 18ch;
  color: #f8fafc;
}

.ticket-drawer__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ticket-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 16px;
  border: 1px solid rgba(125, 211, 252, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(2, 6, 23, 0.22);
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.ticket-drawer__close:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 14px 30px rgba(2, 6, 23, 0.28);
}

.ticket-drawer__body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: auto;
  scrollbar-gutter: stable;
  position: relative;
  z-index: 1;
}

.ticket-drawer__state {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(248, 250, 252, 0.82);
  border: 1px solid rgba(215, 224, 234, 0.9);
}

.ticket-drawer__state--error {
  background: rgba(254, 242, 242, 0.9);
  border-color: rgba(248, 113, 113, 0.28);
}

.ticket-drawer__spinner,
.ticket-drawer__state-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ticket-drawer__spinner {
  border: 3px solid rgba(14, 165, 233, 0.16);
  border-top-color: var(--color-primary);
  animation: tickets-spin 0.8s linear infinite;
}

.ticket-drawer__state-icon {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  font-weight: 800;
}

.ticket-drawer__state-title {
  margin: 0 0 6px;
  font-size: 1rem;
  font-weight: 800;
}

.ticket-drawer__state-text {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.ticket-drawer__section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px;
  border-radius: 22px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.84), rgba(247, 250, 252, 0.72));
  border: 1px solid rgba(215, 224, 234, 0.88);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.04);
  backdrop-filter: blur(6px);
}

.ticket-drawer__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.ticket-drawer__ticket-id,
.ticket-drawer__section-meta {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  font-weight: 700;
}

.ticket-drawer__description {
  margin: 0;
  color: var(--color-text);
  line-height: 1.75;
  white-space: pre-line;
  font-size: 0.96rem;
}

.ticket-drawer__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.ticket-drawer__card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(247, 250, 252, 0.76));
  border: 1px solid rgba(215, 224, 234, 0.86);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.ticket-drawer__card strong {
  font-size: 0.98rem;
}

.ticket-drawer__card span:last-child {
  color: var(--color-text-muted);
  line-height: 1.5;
}

.ticket-drawer__comments {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticket-drawer__comment {
  padding: 16px;
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(247, 250, 252, 0.8));
  border: 1px solid rgba(215, 224, 234, 0.88);
}

.ticket-drawer__comment-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.ticket-drawer__comment-topline strong {
  font-size: 0.94rem;
}

.ticket-drawer__comment-topline span {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  font-weight: 700;
}

.ticket-drawer__comment p,
.ticket-drawer__empty-comments {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}

.ticket-drawer-enter-active,
.ticket-drawer-leave-active {
  transition: opacity 0.36s ease;
}

.ticket-drawer-enter-active .ticket-drawer__backdrop {
  animation: ticket-drawer-backdrop-in 0.42s ease forwards;
}

.ticket-drawer-leave-active .ticket-drawer__backdrop {
  animation: ticket-drawer-backdrop-out 0.32s ease forwards;
}

.ticket-drawer-enter-active .ticket-drawer__panel {
  animation: ticket-drawer-sketch-in 0.76s cubic-bezier(0.165, 0.84, 0.44, 1) both;
}

.ticket-drawer-leave-active .ticket-drawer__panel {
  animation: ticket-drawer-sketch-out 0.42s cubic-bezier(0.165, 0.84, 0.44, 1) both;
}

.ticket-drawer-enter-active .ticket-drawer__outline rect {
  animation: ticket-drawer-outline-in 0.56s 0.12s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.ticket-drawer-leave-active .ticket-drawer__outline rect {
  animation: ticket-drawer-outline-out 0.28s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
}

.ticket-drawer-enter-active .ticket-drawer__header-copy,
.ticket-drawer-enter-active .ticket-drawer__close,
.ticket-drawer-enter-active .ticket-drawer__body > * {
  animation: ticket-drawer-item-in 0.4s 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.ticket-drawer-enter-active .ticket-drawer__close {
  animation-delay: 0.48s;
}

.ticket-drawer-enter-active .ticket-drawer__body > *:nth-child(1) {
  animation-delay: 0.5s;
}

.ticket-drawer-enter-active .ticket-drawer__body > *:nth-child(2) {
  animation-delay: 0.56s;
}

.ticket-drawer-enter-active .ticket-drawer__body > *:nth-child(3) {
  animation-delay: 0.62s;
}

.ticket-drawer-enter-active .ticket-drawer__body > *:nth-child(4) {
  animation-delay: 0.68s;
}

.ticket-drawer-enter-active .ticket-drawer__body > *:nth-child(5) {
  animation-delay: 0.74s;
}

.ticket-drawer-enter-from,
.ticket-drawer-leave-to {
  opacity: 0;
}

.ticket-drawer-enter-from .ticket-drawer__panel,
.ticket-drawer-leave-to .ticket-drawer__panel {
  opacity: 0;
}

.ticket-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.ticket-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ticket-form-field span {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.72);
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

  .tickets-table__topline,
  .tickets-table__content {
    flex-direction: column;
  }

  .tickets-table__supporting,
  .ticket-drawer__grid {
    grid-template-columns: 1fr;
  }

  .tickets-table__meta-card {
    min-width: 0;
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

  .ticket-drawer__panel {
    width: 100%;
    height: 100%;
    border-radius: 24px;
  }

  .ticket-form-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes tickets-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ticket-drawer-item-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ticket-drawer-outline-in {
  from {
    stroke-dashoffset: 2600;
    opacity: 1;
  }

  to {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

@keyframes ticket-drawer-outline-out {
  from {
    stroke-dashoffset: 0;
    opacity: 1;
  }

  to {
    stroke-dashoffset: 2600;
    opacity: 0;
  }
}

@keyframes ticket-drawer-backdrop-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes ticket-drawer-backdrop-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@keyframes ticket-drawer-sketch-in {
  0% {
    transform: translateX(120px) scale(0.96);
    opacity: 0;
    background: transparent;
    border-color: rgba(125, 211, 252, 0);
  }

  45% {
    transform: translateX(18px) scale(0.985);
    opacity: 0.86;
    background: transparent;
    border-color: rgba(125, 211, 252, 0);
  }

  100% {
    transform: translateX(0) scale(1);
    opacity: 1;
    background:
      linear-gradient(180deg, rgba(245, 249, 253, 0.98), rgba(236, 244, 251, 0.96));
    border-color: rgba(215, 224, 234, 0.9);
  }
}

@keyframes ticket-drawer-sketch-out {
  0% {
    transform: translateX(0) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateX(120px) scale(0.97);
    opacity: 0;
    background: transparent;
    border-color: rgba(125, 211, 252, 0);
  }
}
</style>
