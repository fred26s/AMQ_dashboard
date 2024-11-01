import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import newsView from '../views/news.vue'
import monitorView from '../views/monitor.vue'
import traceView from '../views/trace.vue'
import drawView from '../views/drawView.vue'
import tradePulseView from '../views/tradePulse.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: HomeView
    },
    {
      path: '/news',
      name: 'news',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: newsView
    },
    {
      path: '/monitor',
      name: 'monitor',
      component: monitorView
    },
    {
      path: '/trace',
      name: 'trace',
      component: traceView
    },
    {
      path: '/draw',
      name: 'draw',
      component: drawView
    },
    {
      path: '/tradePulse',
      name: 'tradePulse',
      component: tradePulseView
    }
  ]
})

export default router
