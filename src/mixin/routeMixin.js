import Vue from "vue";

export default {
    data() {
        return {

        }
    },
    methods: {
        setRouteHistory() {
            //存储路由历史记录到localStorage
            this.$storage.set('fromRoute', this.$route.name)
        },
        getRouteHistory() {
            //从localStorage获取路由历史记录  
            return this.$storage.get('fromRoute')
        },
        removeRouteHistory() {
            //从localStorage清除路由历史记录
            this.$storage.remove('fromRoute')
        }
    }
}