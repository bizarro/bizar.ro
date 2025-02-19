const { merge } = require('webpack-merge')
const config = require('./webpack.config')

module.exports = merge(config, {
  mode: 'development',

  devtool: 'inline-source-map',

  output: {
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js',
  },
})
