import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/about',
    name: 'about',    
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/',
    name: 'agenda',
    component: () => import('../views/AgendaView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
