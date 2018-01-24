var path = require('path')
var webpack = require('webpack')

var resolve = (p) => path.resolve(__dirname, p);

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionPlugin = require("compression-webpack-plugin")

module.exports = {
  entry: {
    'geodb-demo': './src/main.js',
    'geodb-find-cities-demo': './src/components/find-cities/index.js',
    'geodb-find-countries-demo': './src/components/find-countries/index.js',
    'geodb-find-country-regions-demo': './src/components/find-country-regions/index.js',
    'geodb-find-country-region-cities-demo': './src/components/find-country-region-cities/index.js',
    'geodb-find-nearby-cities-demo': './src/components/find-nearby-cities/index.js',
    'geodb-get-city-details-demo': './src/components/get-city-details/index.js',
    'geodb-get-city-datetime-demo': './src/components/get-city-datetime/index.js',
    'geodb-get-city-distance-demo': './src/components/get-city-distance/index.js',
    'geodb-get-city-time-demo': './src/components/get-city-time/index.js',
    'geodb-get-country-details-demo': './src/components/get-country-details/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: '[name].js'
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'public': resolve('./public')
    }
  },
  module: {
    rules: [
      {
        parser: {
          amd: false
        }
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          objectAssign: 'Object.assign'
        }
      },
      {
        test: /\.styl$/,
        loader: ['style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    }),
    new CompressionPlugin({
      test: /\.js/,
      asset: '[file]'
    })
  ])
}
