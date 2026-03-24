# Contexto del Proyecto

## Qué es este repo

Frontend SPA de HelpDesk construido con Vue 3 para consumir un backend REST separado. El producto apunta al MVP de un sistema de tickets interno, simple pero prolijo, sin recargas completas de página.

## Objetivo de producto

Permitir operar el ciclo principal de tickets desde una única SPA:

- listar tickets
- filtrar y buscar
- ver detalle
- crear ticket
- asignar ticket
- cambiar estado
- comentar
- manejar tags si el backend lo soporta

## Regla principal de integración

Este frontend no define el dominio del negocio ni el contrato de datos. Consume lo que el backend real expone.

Implicancias:

- no inventar endpoints
- no inventar payloads
- no inventar shapes de response
- si la API difiere de la expectativa inicial, el frontend se adapta
- los errores `422` deben mapearse a mensajes por campo

## Expectativa de UX

- SPA real, sin reload completo al enviar formularios o ejecutar acciones
- navegación clara
- estados de carga, vacío y error
- feedback visible de éxito y error
- confirmaciones para acciones sensibles
- UI simple, sobria y profesional

## MVP funcional esperado

### Listado de tickets

Ruta objetivo: `/tickets`

Capacidades:

- filtros por `status`, `assignee_id`, `tag_id`
- búsqueda por `q`
- paginación
- sincronización de filtros con querystring

### Creación de ticket

Ruta objetivo: `/tickets/new`

Campos mínimos:

- `subject`
- `description`
- `priority`

### Detalle de ticket

Ruta objetivo: `/tickets/:id`

Mostrar:

- subject
- description
- status
- priority
- requester
- assignee
- fechas
- comentarios
- tags

Permitir:

- asignar ticket
- cambiar estado
- agregar comentario con `visibility: public | internal`
- gestionar tags si aplica

## Endpoints esperados

- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/{id}`
- `POST /api/tickets/{id}/assign`
- `POST /api/tickets/{id}/status`
- `POST /api/tickets/{id}/comments`
- `POST /api/tickets/{id}/tags` opcional

## Formatos que el frontend debe tolerar

- paginación estilo Laravel con `data`, `links`, `meta`
- errores de validación `422` con `errors.{field}[]`

## Stack preferido

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- TypeScript preferido
- TailwindCSS opcional
- TanStack Query opcional

## Estructura objetivo del código

```text
src/
  app/
  router/
  store/
  http/
  config/
  modules/
    tickets/
      api/
      components/
      pages/
      store/
      types/
  shared/
    components/
    composables/
    utils/
    ui/
```

## Convenciones de trabajo

- separar UI, estado y acceso HTTP
- evitar lógica mezclada en páginas o componentes
- centralizar configuración en variables de entorno
- preferir TypeScript al agregar nuevas piezas
- mantener componentes de UI enfocados en render y eventos

## Variables de entorno esperadas

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_PREFIX=/api
VITE_USE_BEARER_AUTH=false
```

## Autenticación

MVP inicial:

- soportar backend sin auth
- dejar preparada una vía simple para bearer auth si el entorno lo requiere

No asumir auth compleja hasta que el backend real la exija.

## Flujo deseado por feature

### Listado

- filtros cambian estado local y querystring
- eso dispara fetch al endpoint de tickets
- la UI se actualiza sin reload

### Detalle

- la ruta carga el ticket
- las acciones hacen `POST`
- luego se refresca el detalle o se aplica un update optimista seguro

### Formularios

- submit asincrónico
- sin navegación forzada si no aporta valor
- mostrar loading, éxito y errores inline

## Restricciones

- no hacer backend mock si la API real existe
- no usar librerías pesadas sin motivo
- no inventar contrato de datos
- no hacer formularios con recarga completa

## Estado actual

Estado al 2026-03-21:

- repo base creado con Vue 3 + Vite
- router inicial presente
- falta implementar la arquitectura modular y el MVP funcional
- `App.vue` todavía requiere corrección para ser un componente Vue válido

## Cómo usar este archivo en futuras charlas

Tomar este documento como contexto persistente del proyecto. Si en conversaciones futuras hay que implementar pantallas, stores, cliente HTTP, manejo de errores o estructura de carpetas, este archivo define la intención base y las restricciones del frontend.
