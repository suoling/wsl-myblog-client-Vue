import Vue from 'vue'
import Router from 'vue-router'

import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import PublishArticle from '../components/PublishArticle.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'register',
    component: Register,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: true },
  },
  {
    path: '/publish/article',
    name: 'publish/article',
    component: PublishArticle,
    meta: { requiresAuth: true },
  }
]

const router = new Router({
  mode: 'history',
  routes
})

export default router