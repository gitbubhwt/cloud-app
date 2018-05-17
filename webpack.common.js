const path = require('path');

const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    app: './src/index.js',
    vendor: [
      //在这里添加所需打入vendor的库
      'react', 'react-dom'
    ]
  },
  output: {
    //  <!-- 指定打包后的文件名字 -->
    // filename:"bundle.js",
    // 开发模式下devserver有开启热替换，不能使用chunkhash
    // hash和chunkhash的区别 -- hash是对所有打包的资源（assets）产生的某一种全局hash（global hash）,（只是output下面的文件,不包含图片、css等插件的hash）
    // chunkhash是对每个输出文件的chunk做的hash
    filename: isDev ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
    chunkFilename: isDev ? '[name].bundle.js' : '[name].[chunkhash].bundle.js',
    // <!-- 打包后的文件路径 -->
    path: path.resolve(__dirname, "build"),
    sourceMapFilename: isDev ? '[name].map' : '[name].[chunkhash].map'
  },
  module: {
    rules: [
      //js文件解析
      {
        test: /\.(jsx|js)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['env', {
              targets: {
                browsers: [
                  'last 2 versions',
                  'Firefox ESR',
                  '> 1%',
                  'ie >= 9',
                  'iOS >= 8',
                  'Android >= 4',
                ],
              },
            }], 'react', 'stage-2'],
            // plugins: ["import"]
            plugins: [
              ["import", [
                { libraryName: "antd-mobile", style: 'css' },
                { libraryName: "antd", style: 'css' }
              ]
              ] // `style: true` 会加载 less 文件
            ]
            // plugins: []
          }
        }
      },
      //样式文件解析
      {
        test: /\.(css)$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              // modules:true,
              // minimize: true
            }
          }
        ],
        //需要解析node_modules里antd的样式
        // exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.(less)$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              // modules:true,
              // minimize: true
            }
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ],
        // exclude: /(node_modules|bower_components)/
      },
      //图片文件解析
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'url-loader?limit=10000&name=img/[name].[hash].[ext]'
        ],
        exclude: /(node_modules|bower_components)/
      },
      //字体文件解析
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader?name=css/[name].[hash]'
        ],
        exclude: /(node_modules|bower_components)/
      },
      //读取html，是html中引用的静态资源能被webpack加载到
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    //复制你的静态页面到指定位置
    new HtmlWebpackPlugin({
      title: "首页",
      // <!-- 指定模板位置 -->
      template: './src/index.html',
      // <!-- 指定打包后的文件名字 -->
      filename: 'index.html'
    }),

    //产生一个Manifest.json
    new ManifestPlugin(),

    //复制指定文件
    // new CopyWebpackPlugin([
    //   {
    //       from:"./src/static/js",
    //       to:"./static/js"
    //     }
    //   ]),
    //通过将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存起来到缓存中供后续使用。
    //将你的代码拆分成第三方公共代码和应用代码。
    //vendor的提取要配合 NamedModulesPlugin（开发） 或者  HashedModuleIdsPlugin（生产）来使用，
    //默认打包时 chunkhash会随着每个chunk自身的 module.id（一个数字id,每次导入都会自增） 的修改而发生变化,上述两个插件可以修改module.id标识(identify),从而避免未修改文件的chunkhash修改
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      // 随着 entrie chunk 越来越多，
      // 这个配置保证没其它的模块会打包进 vendor chunk
    }),

    //webpack 的样板(boilerplate,包含runtime和manifest)提取出来,默认只抽离vendor的话，vendor里会包含boilerplate
    //manifest保存的文件真实名和 hash名之间的映射关系，每次打包会有变化，只有单独提取出来才能保证vendor的稳定
    //manifest需注意与vendor的顺序,vendor需要先执行，
    //vendor是特定的entry chunk,与entry配置里的vendor是对应的,
    //boilerplate的提取只要chunk名不与已有chunk冲突就可以自动提取，但通常叫manifest或者runtime
    new webpack.optimize.CommonsChunkPlugin({
      name: "runtime",
    }),
    //  new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require('./dist/vendors-manifest.json')
    // })
    // new ChunkManifestPlugin({
    //   filename: 'manifest.json',
    //   manifestVariable: 'webpackManifest',
    //   inlineManifest: false
    // }),
  ],
  resolve: {
    extensions: ['.jsx', '.js'],
    //设置软链接
    alias: {
      'Static': path.resolve(__dirname, './src/static'),
      'Ajax': path.resolve(__dirname, './src/utils/ajax'),
      'Utils': path.resolve(__dirname, './src/utils'),
      'Constants': path.resolve(__dirname, './src/constants'),
      'Actions': path.resolve(__dirname, './src/actions'),
      'Components': path.resolve(__dirname, './src/components'),
    }
  },
  // externals: {
  //   jquery: 'jQuery'
  // },
};