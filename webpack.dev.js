const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const webpack = require('webpack');
//const makeMock = require('icsoc-mock');
const path = require('path');


const $PATH = '';

CommonConfig.output.publicPath = $PATH + "/static/";

module.exports = Merge(CommonConfig, {
    //此选项控制是否生成，以及如何生成 source map。
    devtool: 'inline-source-map',
    plugins: [
        //当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        //也是用于vendor  hash 变化的修复
        new webpack.NamedModulesPlugin((chunk) => {
            if (chunk.name) {
                return chunk.name;
            }
            //处理异步chunk（async-chunk）命名问题
            return chunk.modules.map(m => path.relative(m.context, m.request)).join("_");
        }),
        //DefinePlugin只是来执行process.env.NODE_ENV的查找和替换操作，
        //构建脚本 webpack.config.js 中的 process.env.NODE_ENV 并不会被设置为 "production"
        //可以通过cross-env在npm脚本中注入变量
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            },
            '$PATH': JSON.stringify($PATH),
        }),
    ],
    devServer: {
        //指定静态文件的路径
        // contentBase: './src',
        contentBase: path.join(__dirname, "build"),
        //通过setup方法，可以获得app对象,从而扩展devServer或添加中间件
        /*setup(app) {
            makeMock(app, {
                //mock目录
                mockPath: 'mock',
                //支持设置统一接口后缀，如：.do
                apiExt: ''
            });
        },
		*/
        allowedHosts: [ //白名单
            '.icsoc.net'
            // '.host.com',//可以匹配所有xx.host.com
            // 'subdomain.host.com',
        ],
        compress: true, //开启gzip
        port: 3001,
        proxy: {
            "/ticket/v1/flow": {
                target: "http://e.v2.dev.icsoc.net",
                changeOrigin: true
            },
            "/ticket/im": {
                target: "http://127.0.0.1:8040",
                changeOrigin: true
            },
            "/ticket/api": {
                target: "http://e.v2.dev.icsoc.net",
                changeOrigin: true
            },
            "/access_token": {
                target: "http://oauth-dev.icsoc.net",
                changeOrigin: true
            }
        },
        //当单页模式采用HTML5 History API 时
        //开启此选项,任意的 404 响应都可能需要被替代为index.html,可以通过rewrites进一步详细指定
        historyApiFallback: {
            index: CommonConfig.output.publicPath + "index.html",
            rewrites: [
                { from: /^\/$/, to: CommonConfig.output.publicPath + 'index.html' },
            ]
        },
        // publicPath: $PATH + "/"
    }
})