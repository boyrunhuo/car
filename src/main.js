import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import animated from 'animate.css'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'


Vue.config.productionTip = false
Vue.prototype.$dayjs = dayjs
dayjs.locale('zh-cn')

Vue.use(ElementUI);
Vue.use(animated)
Vue.use(Mint);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
