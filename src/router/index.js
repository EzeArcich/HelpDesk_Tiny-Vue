import { createRouter, createWebHistory } from 'vue-router'
import TicketsPage from '../modules/tickets/pages/TicketsListPage.vue'
import ConfigPage from '../modules/settings/pages/ConfigPage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/tickets',
    },
    {
      path: '/tickets',
      name: 'tickets',
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
