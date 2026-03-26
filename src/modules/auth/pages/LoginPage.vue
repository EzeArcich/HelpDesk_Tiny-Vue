<template>
  <section class="login-page">
    <div class="login-page__panel">
      <div class="login-page__brand">
        <span class="login-page__eyebrow">HelpDesk</span>
        <h1 class="login-page__title">Entrá al centro operativo</h1>
        <p class="login-page__description">
          Accedé a la bandeja, seguimiento y acciones del equipo desde una interfaz clara, rápida
          y diseñada para soporte real.
        </p>
      </div>

      <div class="login-page__layout">
        <section class="login-page__intro-card">
          <div class="login-page__pulse"></div>

          <p class="login-page__kicker">Workspace</p>
          <h2 class="login-page__intro-title">Soporte con foco, contexto y ritmo</h2>
          <p class="login-page__intro-text">
            Unificá tickets, estados y respuestas en un mismo flujo. Menos ruido. Más claridad
            operacional.
          </p>

          <div class="login-page__feature-list">
            <article class="login-page__feature">
              <span class="login-page__feature-index">01</span>
              <div>
                <h3>Bandeja viva</h3>
                <p>Filtrado, paginación y detalle contextual sin salir de la vista.</p>
              </div>
            </article>

            <article class="login-page__feature">
              <span class="login-page__feature-index">02</span>
              <div>
                <h3>Respuestas rápidas</h3>
                <p>Acciones y comentarios preparados para operar tickets en tiempo real.</p>
              </div>
            </article>

            <article class="login-page__feature">
              <span class="login-page__feature-index">03</span>
              <div>
                <h3>Visión operativa</h3>
                <p>Diseño pensado para mantener foco mientras el equipo resuelve casos.</p>
              </div>
            </article>
          </div>
        </section>

        <section class="login-page__form-shell">
          <div class="login-page__form-card">
            <div class="login-page__form-head">
              <p class="login-page__form-kicker">Acceso seguro</p>
              <h2 class="login-page__form-title">Iniciar sesión</h2>
            </div>

            <form class="login-form" @submit.prevent>
              <label class="login-form__field">
                <span>Correo</span>
                <input type="email" placeholder="equipo@helpdesk.app" />
              </label>

              <label class="login-form__field">
                <span>Contraseña</span>
                <input type="password" placeholder="••••••••" />
              </label>

              <div class="login-form__row">
                <label class="login-form__check">
                  <input type="checkbox" />
                  <span>Recordarme</span>
                </label>

                <a href="#" class="login-form__link">Recuperar acceso</a>
              </div>

              <button type="submit" class="login-form__submit">
                Entrar a HelpDesk
              </button>
            </form>

            <div class="login-page__footer-note">
              <span class="login-page__footer-dot"></span>
              <p>Acceso interno del equipo de operaciones y soporte.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </section>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-page__panel {
  width: min(1240px, 100%);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-page__brand {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 720px;
  animation: login-rise-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.login-page__eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.14);
  border: 1px solid rgba(125, 211, 252, 0.14);
  color: #7dd3fc;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.login-page__title {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.login-page__description {
  margin: 0;
  max-width: 640px;
  color: rgba(226, 232, 240, 0.78);
  font-size: 1.04rem;
  line-height: 1.75;
}

.login-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(380px, 460px);
  gap: 28px;
  align-items: stretch;
}

.login-page__intro-card {
  position: relative;
  overflow: hidden;
  padding: 34px;
  border-radius: 34px;
  border: 1px solid rgba(125, 211, 252, 0.14);
  background:
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.76), rgba(15, 23, 42, 0.54));
  box-shadow: 0 30px 80px rgba(2, 6, 23, 0.28);
  backdrop-filter: blur(14px);
  animation: login-rise-in 0.8s 0.08s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.login-page__pulse {
  position: absolute;
  top: -40px;
  right: -20px;
  width: 180px;
  height: 180px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.18), transparent 68%);
  animation: login-pulse 5.5s ease-in-out infinite;
}

.login-page__kicker {
  margin: 0 0 14px;
  color: #7dd3fc;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.login-page__intro-title {
  margin: 0 0 14px;
  max-width: 16ch;
  color: #f8fafc;
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.login-page__intro-text {
  margin: 0;
  max-width: 54ch;
  color: rgba(226, 232, 240, 0.78);
  line-height: 1.8;
}

.login-page__feature-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 34px;
}

.login-page__feature {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(148, 163, 184, 0.12);
  transform: translateY(12px);
  opacity: 0;
  animation: login-rise-in 0.56s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.login-page__feature:nth-child(1) {
  animation-delay: 0.18s;
}

.login-page__feature:nth-child(2) {
  animation-delay: 0.26s;
}

.login-page__feature:nth-child(3) {
  animation-delay: 0.34s;
}

.login-page__feature-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.24), rgba(14, 165, 233, 0.08));
  color: #bae6fd;
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.login-page__feature h3 {
  margin: 0 0 8px;
  color: #f8fafc;
  font-size: 1rem;
}

.login-page__feature p {
  margin: 0;
  color: rgba(226, 232, 240, 0.74);
  line-height: 1.65;
}

.login-page__form-shell {
  position: relative;
  display: flex;
  align-items: stretch;
  animation: login-slide-in 0.8s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.login-page__form-card {
  position: relative;
  width: 100%;
  padding: 30px;
  border-radius: 34px;
  background:
    linear-gradient(180deg, rgba(247, 250, 252, 0.96), rgba(240, 247, 252, 0.92));
  border: 1px solid rgba(215, 224, 234, 0.9);
  box-shadow:
    0 24px 70px rgba(2, 6, 23, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  overflow: hidden;
}

.login-page__form-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 40%, #60a5fa 100%);
}

.login-page__form-head {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 26px;
}

.login-page__form-kicker {
  margin: 0;
  color: var(--color-primary-strong);
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.login-page__form-title {
  margin: 0;
  color: var(--color-text);
  font-size: 2rem;
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.login-form__field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.login-form__field span {
  color: var(--color-text);
  font-size: 0.84rem;
  font-weight: 700;
}

.login-form__field input {
  min-height: 54px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 16px;
  padding: 0 16px;
  background: rgba(255, 255, 255, 0.84);
  color: var(--color-text);
  font: inherit;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.login-form__field input:focus {
  border-color: rgba(14, 165, 233, 0.55);
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
  transform: translateY(-1px);
}

.login-form__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.login-form__check {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--color-text-muted);
  font-size: 0.92rem;
}

.login-form__check input {
  accent-color: var(--color-primary);
}

.login-form__link {
  color: var(--color-primary-strong);
  font-size: 0.9rem;
  font-weight: 700;
}

.login-form__submit {
  margin-top: 6px;
  min-height: 56px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  cursor: pointer;
  box-shadow: 0 18px 36px rgba(2, 132, 199, 0.24);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-form__submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 22px 42px rgba(2, 132, 199, 0.3);
}

.login-page__footer-note {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 22px;
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.login-page__footer-note p {
  margin: 0;
}

.login-page__footer-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%);
  box-shadow: 0 0 0 8px rgba(14, 165, 233, 0.1);
}

@media (max-width: 1040px) {
  .login-page {
    padding: 24px;
  }

  .login-page__layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .login-page {
    padding: 16px;
  }

  .login-page__intro-card,
  .login-page__form-card {
    padding: 24px;
    border-radius: 28px;
  }

  .login-form__row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@keyframes login-rise-in {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes login-slide-in {
  from {
    opacity: 0;
    transform: translateX(36px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes login-pulse {
  0%,
  100% {
    transform: scale(1) translateY(0);
  }

  50% {
    transform: scale(1.08) translateY(12px);
  }
}
</style>
