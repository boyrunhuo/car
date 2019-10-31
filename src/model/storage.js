import Vue from 'vue'
//封装全局localStorage方法
var storage = {
    set(key,value) {
        localStorage.setItem(key,JSON.stringify(value))
    },
    get(key) {
        return JSON.parse(localStorage.getItem(key))
    },
    remove(key) {
        localStorage.removeItem(key)
    }
}
Vue.prototype.$storage = storage

