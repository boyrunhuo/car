const httpTartget = 'http://10.32.16.122:8080' //熊大本地
module.exports = {
    configureWebpack: {
        externals: {
            //高德地图
            "AMap": "AMap"
        },
        module: {
            rules: [
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)$/,
                    loader: 'url-loader',
                    // options: {
                    //     limit: 10000,
                    //     name: 'assets/fonts/[name].[hash:7].[ext]'
                    // }
                }
            ]
        }
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