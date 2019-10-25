import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home/Home'),
        meta: {
            title: '益出行'
        }
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('@/views/Map/Map'),
        meta: {
            title: '地点选择'
        }
    },
    {
        path: '/releaseRouter',
        name: 'releaseRouter',
        component: () => import('@/views/ReleaseRouter/ReleaseRouter'),
        meta: {
            title: '发布行程'
        }
    },
    {
        path: '/ApplyDriver',
        name: 'applyDriver',
        component: () => import('@/views/ApplyDriver/ApplyDriver'),
        meta: {
            title: '车主认证'
        }
    },
    {
        path: '/orderList',
        name: 'orderList',
        component: () => import('@/views/OrderList/OrderList'),
        meta: {
            title: '我的订单'
        }
    },
    {
        path: '/matchOrderList',
        name: 'matchOrderList',
        component: () => import('@/views/OrderList/MatchOrderList'),
        meta: {
            title: '匹配订单'
        }
    },
    {
        path: '/personalCenter',
        name: 'personalCenter',
        component: () => import('@/views/PersonalCenter/PersonalCenter'),
        meta: {
            title: '个人中心'
        }
        
    }

]

export default new Router({
    routes: constantRouterMap
})