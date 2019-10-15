import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home/Home')
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('@/views/Map/Map')
    },
    {
        path: '/address',
        name: 'address',
        component: () => import('@/views/Address/Address')
    },
    {
        path: '/releaseRouter',
        name: 'releaseRouter',
        component: () => import('@/views/ReleaseRouter/ReleaseRouter')
    },

]

export default new Router({
    routes: constantRouterMap
})