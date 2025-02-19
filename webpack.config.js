const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default

const IS_DEVELOPMENT = process.env.NODE_ENV === 'dev'

const dirApp = path.join(__dirname, 'app')
const dirAssets = path.join(__dirname, 'assets')
const dirStyles = path.join(__dirname, 'styles')
const dirNode = 'node_modules'

const folders = [
  'index.html',
  'about/index.html',
  'case/xbox-museum/index.html',
  'case/bbdo/index.html',
  'case/peggy-gou/index.html',
  'case/isabel-moranta/index.html',
  'case/floema/index.html',
  'case/garoa-skincare/index.html',
  'case/design-embraced/index.html',
  'case/kacper-chlebowicz/index.html',
  'case/trolli/index.html',
  'case/adventure-time/index.html',
  'case/studio-maertens/index.html',
  'case/inbound/index.html',
  'case/redis/index.html',
  'case/kaleidoz/index.html',
  'case/erika-moreira/index.html',
  'case/bruno-arizio/index.html',
  'case/dominic-berzins/index.html',
  'case/pagethink/index.html',
  'case/neoway/index.html',
  'case/cult/index.html',
  'case/movida/index.html',
  'case/lufthansa-2/index.html',
  'case/tiaa/index.html',
  'case/lufthansa-1/index.html',
  'case/shell/index.html',
  'case/corvette/index.html',
  'case/nike/index.html',
  'case/airbnb/index.html',
  'case/discovery-kids/index.html',
  'case/rock-in-rio/index.html',
]

const mapFolders = folders.map((filename) => {
  return new HtmlWebpackPlugin({
    filename,
    template: path.join(__dirname, 'index.pug'),
  })
})

module.exports = {
  entry: [path.join(dirApp, 'index.js'), path.join(dirStyles, 'index.scss')],

  output: {
    filename: '[name].[contenthash].js',
  },

  resolve: {
    modules: [dirApp, dirAssets, dirNode],
  },

  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),

    ...mapFolders,

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './shared',
          to: '',
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css',
    }),

    new HTMLInlineCSSWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },

      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },

      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|webp)(\?.*$|$)/i,
        type: 'asset',
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'raw-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: 'glslify-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
