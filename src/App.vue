<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__title">HelpDesk</span>
        <span class="sidebar__subtitle">Mini Ticketing</span>
      </div>

      <nav class="sidebar__nav">
        <RouterLink to="/tickets" class="sidebar__link">
          Tickets
        </RouterLink>
        <RouterLink to="/config" class="sidebar__link">
          Configuración
        </RouterLink>
      </nav>

      <div class="sidebar__panel">
        <p class="sidebar__panel-label">Estado</p>
        <h2 class="sidebar__panel-title">Soporte en marcha</h2>
        <p class="sidebar__panel-text">
          Este panel centraliza la operación de tickets, seguimiento y respuestas del equipo.
        </p>
      </div>

    </aside>

    <div class="app-shell__main">
      <header class="topbar">
        <div class="topbar__intro">
          <p class="topbar__eyebrow">Workspace</p>
          <p class="topbar__title">HelpDesk / Operaciones</p>
        </div>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>

import { RouterLink, RouterView } from 'vue-router'
</script>

<style>
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  padding: 20px;
}

.sidebar {
  background: linear-gradient(180deg, var(--color-sidebar) 0%, var(--color-sidebar-soft) 100%);
  color: white;
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  gap: 36px;
  border-radius: 24px;
  box-shadow: var(--shadow-panel);
  position: relative;
  overflow: hidden;
}

.sidebar::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 140px;
  background: radial-gradient(circle at top right, rgba(14, 165, 233, 0.22), transparent 60%);
  pointer-events: none;
}


.sidebar__brand {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar__title {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.sidebar__subtitle {
  font-size: 0.88rem;
  color: var(--color-sidebar-muted);
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar__link {
  padding: 13px 14px;
  border-radius: 14px;
  color: #dbe7f3;
  border: 1px solid transparent;
  background: transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.sidebar__link.router-link-active {
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.24), rgba(14, 165, 233, 0.12));
  color: #ffffff;
  font-weight: 700;
  border: 1px solid rgba(56, 189, 248, 0.28);
}

.sidebar__link.router-link-exact-active {
  color: #ffffff;
}


.sidebar__link:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(148, 163, 184, 0.18);
  transform: translateX(2px);
}

.sidebar__panel {
  margin-top: auto;
  padding: 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.16), rgba(14, 165, 233, 0.06));
  border: 1px solid rgba(56, 189, 248, 0.18);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.sidebar__panel-label {
  margin: 0 0 8px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #7dd3fc;
}

.sidebar__panel-title {
  margin: 0 0 10px;
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.sidebar__panel-text {
  margin: 0;
  color: #cbd5e1;
  font-size: 0.92rem;
  line-height: 1.6;
}

.app-shell__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 28px;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-soft);
}

.topbar {
  padding: 18px 32px 0;
  display: flex;
  align-items: center;
}

.topbar__eyebrow {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-text-muted);
}

.topbar__title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
}

.topbar__intro {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.content {
  padding: 20px 32px 32px;
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    padding: 16px;
  }

  .topbar {
    padding: 16px 16px 0;
  }

  .content {
    padding: 18px 16px 24px;
  }
}
</style>
