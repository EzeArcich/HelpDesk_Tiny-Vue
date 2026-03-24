# HelpDesk Frontend

![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646cff?logo=vite&logoColor=white)
![Vue Router](https://img.shields.io/badge/Vue_Router-5.0-334155?logo=vuedotjs&logoColor=white)
![Node](https://img.shields.io/badge/Node-22.12-5fa04e?logo=node.js&logoColor=white)
![SPA](https://img.shields.io/badge/Architecture-SPA-0f172a)
![Laravel API](https://img.shields.io/badge/API-Laravel-ff2d20?logo=laravel&logoColor=white)

SPA en Vue 3 para consumir y operar el MVP de HelpDesk (mini ticketing) vía API REST. Este repositorio contiene solo el frontend. El backend vive en otro proyecto y expone los endpoints que esta app consume.

## Objetivo

Construir una interfaz simple pero profesional para operar tickets sin recargas de página:

- listar tickets con filtros, búsqueda y paginación
- ver el detalle de un ticket
- crear tickets
- asignar tickets a agentes
- cambiar estado de tickets
- agregar comentarios públicos o internos
- manejar tags si el backend los expone

La app debe funcionar como SPA: formularios y acciones por request HTTP, sin reload completo de la página.

## Alcance MVP

### Tickets

- listado con filtros `status`, `assignee_id`, `tag_id` y `q`
- paginación compatible con formato Laravel (`data`, `links`, `meta`) si el backend responde así
- detalle con `subject`, `description`, `status`, `priority`, `requester`, `assignee`, fechas, comentarios y tags
- creación de ticket con `subject`, `description` y `priority`
- asignación de ticket
- cambio de estado `open -> in_progress -> closed`
- alta de comentario con `visibility: public | internal`
- tags opcionales

### UX mínima esperada

- layout con navegación clara
- estados de `loading`, vacío y error
- toasts o alerts para éxito y error
- confirmación antes de acciones sensibles, por ejemplo cerrar un ticket
- manejo de errores de validación `422` por campo

## API a consumir

Base URL configurable por variables de entorno.

Endpoints esperados:

- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/{id}`
- `POST /api/tickets/{id}/assign`
- `POST /api/tickets/{id}/status`
- `POST /api/tickets/{id}/comments`
- `POST /api/tickets/{id}/tags` opcional

Regla de integración:

- no inventar endpoints, payloads ni shapes nuevos
- el frontend debe adaptarse a la respuesta real del backend
- si el backend devuelve errores `422` con `errors.{field}[]`, mostrarlos por campo

## Stack propuesto

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- TypeScript preferido
- TailwindCSS opcional
- TanStack Query opcional para caching y request state

## Estructura objetivo

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
  main.ts
  App.vue
```

Reglas:

- separar `api/`, `store/`, `pages/` y `components/`
- no hardcodear URLs
- centralizar config en env
- evitar lógica de negocio compleja dentro de componentes de UI

## Rutas esperadas

- `/tickets`
- `/tickets/new`
- `/tickets/:id`
- `/settings` opcional para modo dev

## Componentes clave

- `TicketsFilters`
- `TicketsTable` o `TicketsList`
- `Pagination`
- `TicketDetails`
- `AssignTicketForm`
- `ChangeStatusControl`
- `AddCommentForm`
- `TagsSelector`
- `Toast` o `Alert`

## Flujo de datos esperado

### Listado

1. el usuario cambia filtros o búsqueda
2. se sincroniza el querystring con Vue Router
3. se dispara `GET /api/tickets?...`
4. se renderiza listado y paginación sin recargar la página

### Detalle

1. al entrar a `/tickets/:id` se hace `GET /api/tickets/{id}`
2. las acciones de assign, status, comments y tags hacen `POST`
3. después de cada acción se hace re-fetch del detalle o actualización optimista

## Variables de entorno

Crear un archivo `.env` a partir de este ejemplo:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_PREFIX=/api
VITE_USE_BEARER_AUTH=false
```

Sugerencia:

- `VITE_API_BASE_URL`: host del backend
- `VITE_API_PREFIX`: prefijo de la API REST
- `VITE_USE_BEARER_AUTH`: `true` o `false` según entorno

## Setup local

### Requisitos

- Node `22.12.0`
- npm

Este repo ya declara versión recomendada en [`.nvmrc`](/var/www/html/helpDesk-own/.nvmrc) y [`.node-version`](/var/www/html/helpDesk-own/.node-version).

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Cómo apuntar al backend local

1. levantar el backend HelpDesk por separado
2. configurar `.env` con la URL real del backend
3. verificar que los endpoints bajo `/api` respondan
4. levantar este frontend con `npm run dev`

Ejemplo:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_PREFIX=/api
VITE_USE_BEARER_AUTH=false
```

Con eso, el frontend debería consumir URLs como:

```text
http://127.0.0.1:8000/api/tickets
```

## Calidad mínima esperada

- ESLint + Prettier
- TypeScript preferido
- tests básicos para utilidades y mappers
- tests de componentes opcionales para filtros/listado
- manejo consistente de errores y estados de carga

## Orden sugerido de implementación

1. scaffold base con Router, Pinia y estructura por módulos
2. cliente HTTP con Axios, config por env e interceptors
3. listado de tickets con filtros y paginación
4. detalle de ticket
5. alta de ticket
6. asignación
7. cambio de estado
8. comentarios
9. tags opcionales
10. pulido de UX y validaciones

## Restricciones

- no implementar backend mock si la API real está disponible
- no meter lógica de negocio pesada en componentes UI
- no usar librerías innecesariamente pesadas
- no inventar endpoints ni payloads
- mantener navegación SPA sin recargas completas

## Estado actual del repo

El proyecto está inicializado con Vue 3 + Vite, pero todavía falta implementar la arquitectura del frontend MVP descrita arriba. Tomar [docs/context.md](/var/www/html/helpDesk-own/docs/context.md) como fuente rápida de contexto para continuar el trabajo en próximas iteraciones.
