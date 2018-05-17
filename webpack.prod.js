const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

const webpack = require('webpack');

module.exports = Merge(CommonConfig, {
  //此选项控制是否生成，以及如何生成 source map。
  devtool: 'source-map',
  plugins: [
  	//bundle 会随着自身的 module.id 的修改，而发生变化
    //vendor 的 hash 发生变化是我们要修复的,否则每次构建都会更改vendor的hash，使我们抽离的第三方公共代码缓存失效
    //使用 HashedModuleIdsPlugin 用于生产环境构建
    new webpack.HashedModuleIdsPlugin(),


  	//以下三个插件也可以通过webpack －p命令来自动执行
  	//统一设置支持minimize的loader(防止不支持的，直接写loader里报错)
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    //DefinePlugin只是来执行process.env.NODE_ENV的查找和替换操作，
    //构建脚本 webpack.config.js 中的 process.env.NODE_ENV 并不会被设置为 "production"
    //可以通过cross-env在npm脚本中注入变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        keep_fnames: true //是否压缩函数名，默认为false,true为不压缩
      },
      compress: {
      	warnings: false //去掉压缩日志warnings
      },
      comments: false,//保护注解
      ie8: false,//默认就是false
      sourceMap:true,
  	})
  ]
})