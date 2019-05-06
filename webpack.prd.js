 const merge        = require('webpack-merge');
 const common       = require('./webpack.common.js');
 const TerserPlugin = require('terser-webpack-plugin');

 module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  performance: {
    maxEntrypointSize: 1000000,
    maxAssetSize     : 1000000
  },
  optimization: {
    minimizer: [new TerserPlugin({
      terserOptions: {
        output: {
          comments: false
        }
      }
    })],
  }
 });