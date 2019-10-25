import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
import { Toast } from "vant";
import Vue from 'vue'
Vue.use(Toast);

axios.interceptors.request.use(config => {
    NProgress.inc(0.2)
    config.timeout = 15000
    return config
},
    error => {

        NProgress.done()
    })

axios.interceptors.response.use(response => {

    NProgress.done()
    if (response.data.code === 1) {
        return response.data
    } else if (response.data.code === 0) {
        const error = new Error()
        error.data = response.data
        throw error
    }
},
    error => {
        // 这里是返回状态码不为200时候的错误处理
        if (error.response.status) {
            switch (error.response.status) {
                case 400:
                    error.message = '请求错误'
                    break

                case 401:
                    error.message = '未授权，请登录'
                    break

                case 403:
                    error.message = '拒绝访问'
                    break

                case 404:
                    error.message = `请求地址出错: ${error.response.config.url}`
                    break

                case 408:
                    error.message = '请求超时'
                    break

                case 500:
                    error.message = '服务器内部错误'
                    break

                case 501:
                    error.message = '服务未实现'
                    break

                case 502:
                    error.message = '网关错误'
                    break

                case 503:
                    error.message = '服务不可用'
                    break

                case 504:
                    error.message = '网关超时'
                    break

                case 505:
                    error.message = 'HTTP版本不受支持'
                    break

                default:

            }

            return Promise.reject(error)

        }
    })


Vue.prototype.$http = axios
