import Vue from 'vue'
import Router from 'vue-router'

import Register from '../components/Register.vue'
import Login from '../components/Login.vue'
import ArticlePublish from '../components/ArticlePublish.vue'
import ArticleList from '../components/ArticleList.vue'
import ArticleDetail from '../components/ArticleDetail'
import ArticleEdit from '../components/ArticleEdit'

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
    path: '/article/publish',
    name: 'article/publish',
    component: ArticlePublish,
    meta: { requiresAuth: true },
  },
  {
    path: '/article/list',
    name: 'article/list',
    component: ArticleList,
    meta: { requiresAuth: true },
  },
  {
    path: '/article/detail/:userId/:articleId',
    name: 'article/detail',
    component: ArticleDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/article/edit/:userId/:articleId',
    name: 'article/edit',
    component: ArticleEdit,
    meta: { requiresAuth: true },
  }
]

const router = new Router({
  mode: 'history',
  routes
})

export default router