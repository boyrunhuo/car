// const httpTartget = 'http://10.32.16.122:8080' //熊大本地
const httpTartget = 'http://10.32.64.129:13288'//外测
const path = require('path')
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
                    'Carride-Access-Token': '1234567'
                }
            },
            '/user/': {
                target: httpTartget,
                changeOrigin: true,
                //暂时自带登录token，之后对接登录接口了删除
                headers: {
                    'Carride-Access-Token': '1234567'
                }
            }
        }
    }
}