const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackConfigBase = require('./webpack.base.conf');

const webpackConfigDev = {
    mode: 'development', // 通过 mode 声明开发环境

    output: {
        path: path.resolve(__dirname, '../dist'),
        // 打包多出口文件
        filename: './js/[name].bundle.js'
    },

    plugins: [
        //热更新
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.BASE_URL': '\"' + process.env.BASE_URL + '\"'
        })
    ],

    devtool: "source-map", // 开启调试模式

    devServer: {
        contentBase: path.join(__dirname, "../src"),
        publicPath: '/',
        host: "127.0.0.1",
        port: "8090",
        overlay: true, // 浏览器页面上显示错误
        open: true, // 开启浏览器
        // stats: "errors-only", //stats: "errors-only"表示只打印错误：
        hot: true, // 开启热更新
        //服务器代理配置项
        proxy: {
            '/hy/*': {
                target: 'http://172.18.0.23',
                secure: true,
                changeOrigin: true
            }, '/mnu/*': {
                target: 'http://cszz.eelantech.com:2880/',
                secure: true,
                changeOrigin: true
            }
            /*  '/hy/*': {
                 target: 'http://172.18.0.23:7000',
                 secure: true,
                 changeOrigin: true
             } */
        }
    },
}
module.exports = merge(webpackConfigBase, webpackConfigDev);