import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/receiver',
    name: 'Receiver',
    component: () => import(/* webpackChunkName: "receiver" */ '../views/game/receiver/Receiver.vue')
  },
  {
    path: '/sender',
    name: 'sender',
    component: () => import(/* webpackChunkName: "sender" */ '../views/game/sender/Sender.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
