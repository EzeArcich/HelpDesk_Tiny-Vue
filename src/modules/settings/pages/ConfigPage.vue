<template>
  <section class="tickets-page">
    <div class="tickets-page__card">
      <p class="tickets-page__eyebrow">Configuración</p>
      <h2 class="tickets-page__title">Ajustes de usuario</h2>
      <p class="tickets-page__description">
        Esta es la segunda vista de la SPA. Acá después vamos a montar la configuración,
        dependiendo del nivel de acceso del usuario.
      </p>
    </div>
  </section>
</template>

<style scoped>
.tickets-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tickets-page__card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  padding: 24px;
}

.tickets-page__eyebrow {
  margin: 0 0 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
}

.tickets-page__title {
  margin: 0 0 10px;
  font-size: 1.5rem;
}

.tickets-page__description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}
</style>
