import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../modules/auth/pages/LoginPage.vue'
import TicketsPage from '../modules/tickets/pages/TicketsListPage.vue'
import ConfigPage from '../modules/settings/pages/ConfigPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return false
  },
  routes: [
    {
      path: '/',
      redirect: '/tickets',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: {
        layout: 'auth',
      },
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: TicketsPage,
    },
    {
      path: '/tickets/:id',
      name: 'ticket.detail',
      component: TicketsPage,
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigPage,
    },
  ],
})

export default router
