const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.common.js");
const webpack = require("webpack");
const path = require("path");

const $PATH = "";

CommonConfig.output.publicPath = $PATH + "/static/";

module.exports = Merge(CommonConfig, {
  //此选项控制是否生成，以及如何生成 source map。
  devtool: "inline-source-map",
  plugins: [
    //当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
    //也是用于vendor  hash 变化的修复
    new webpack.NamedModulesPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }
      //处理异步chunk（async-chunk）命名问题
      return chunk.modules
        .map(m => path.relative(m.context, m.request))
        .join("_");
    }),
    //DefinePlugin只是来执行process.env.NODE_ENV的查找和替换操作，
    //构建脚本 webpack.config.js 中的 process.env.NODE_ENV 并不会被设置为 "production"
    //可以通过cross-env在npm脚本中注入变量
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development")
      },
      $PATH: JSON.stringify($PATH)
    })
  ],
  devServer: {
    //指定静态文件的路径
    // contentBase: './src',
    contentBase: path.join(__dirname, "build"),
    compress: true, //开启gzip
    port: 3001,
    proxy: {
      "/cloud": {
        target: "http://127.0.0.1:8010",
        changeOrigin: true
      }
    },
    //当单页模式采用HTML5 History API 时
    //开启此选项,任意的 404 响应都可能需要被替代为index.html,可以通过rewrites进一步详细指定
    historyApiFallback: {
      index: CommonConfig.output.publicPath + "index.html",
      rewrites: [
        { from: /^\/$/, to: CommonConfig.output.publicPath + "index.html" }
      ]
    }
    // publicPath: $PATH + "/"
  }
});
