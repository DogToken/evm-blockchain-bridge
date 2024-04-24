import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Origin.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '/bridge-back',
    name: 'Destination',

    component: () => import('../views/Destination.vue'),
  },

  // TODO: for 404 errors
{
  path: '/:catchAll(.*)',
  component: () => import('../views/Origin.vue'), // Replace with your desired fallback component
  name: 'Home',
},
]

const router = createRouter({
  history: createWebHistory(),

  routes,
})

export default router
