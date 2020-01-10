// const httpTartget = 'http://10.32.16.122:8080' //熊大本地
// const httpTartget = 'http://10.32.64.129:13288'//外测
const httpTartget = 'http://10.32.64.216:13288'//正式
const path = require('path')
// const Cookie = 'Carride-Access-Token=cPMJbGHnj7kz;'//熊大
const Cookie = 'Carride-Access-Token=SYsfMnRiEEWM;'//赵堃圻
module.exports = {

    configureWebpack: {
        externals: {
            //高德地图
            "AMap": "AMap"
        },

    },
    chainWebpack: config => {
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(path.resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()

    },
    devServer: {
        proxy: {
            '/order/': {
                target: httpTartget,
                changeOrigin: true,
                //暂时自带登录token，之后对接登录接口了删除
                headers: {
                    'Cookie': Cookie
                }
            },
            '/user/': {
                target: httpTartget,
                changeOrigin: true,
                //暂时自带登录token，之后对接登录接口了删除
                headers: {
                    'Cookie': Cookie
                }
            },
            '/account': {
                target: httpTartget,
                changeOrigin: true,
                //暂时自带登录token，之后对接登录接口了删除
                headers: {
                    'Cookie': Cookie
                }
            }
        }
    }
}