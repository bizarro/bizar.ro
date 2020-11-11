const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirNode = 'node_modules'

module.exports = {
  entry: [
    path.join(dirApp, 'index.js')
  ],

  resolve: {
    modules: [
      dirApp,
      dirAssets,
      dirNode
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT
    }),

    new webpack.ProvidePlugin({

    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'index.pug')
    }),

    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(__dirname, '404.pug')
    }),

    new CopyWebpackPlugin([
      {
        from: './app/service-worker.js',
        to: ''
      }
    ]),

    new CopyWebpackPlugin([
      {
        from: './offline',
        to: 'offline'
      }
    ]),

    new CopyWebpackPlugin([
      {
        from: './shared',
        to: ''
      }
    ])
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader']
      },

      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env'
              ]
            ]
          }
        }
      },

      {
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
        loader: 'file-loader',
        options: {
          name (file) {
            return '[hash].[ext]'
          }
        }
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/
      }
    ]
  }
}
