import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import './services'
// 引入animate.css动画
import animated from 'animate.css'
// 引入Vant UI组件的样式
import 'vant/lib/index.css';
// 引入dayjs
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import './model/storage'
import '@/icons' // icon
import '@vant/touch-emulator';


Vue.config.productionTip = false

Vue.prototype.$dayjs = dayjs

dayjs.locale('zh-cn')

Vue.use(ElementUI).use(animated);


router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
