import Vue from 'vue'
import Router from 'vue-router'
import ArticleList from '../views/ArticleList.vue'
import ArticleDetail from '../views/ArticleDetail'
import ArticleOpera from '../views/ArticleOpera'
// import NotFound from '../views/NotFound'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'article/list',
    component: ArticleList,
    props: { listFlag: '测试一下props对象模式' },
    meta: { requiresAuth: true },
  },
  {
    path: '/article/detail/:id/:type',
    name: 'article/detail',
    component: ArticleDetail,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/article/opera',
    name: 'article/opera',
    component: ArticleOpera,
    props: route => ({ id: route.query.id, type: route.query.type }),
    meta: { requiresAuth: true },
  },
  {
    path: '*',
    component: ArticleList
  }
]

const router = new Router({
  mode: 'history',
  routes
})

// router.beforeEach((to, from, next) => {
//   console.log('to, from, next:', to, from, next)
//   next()
// })

export default router