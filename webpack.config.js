'use strict';


var pathUtil = require('path');


module.exports = {
  entry: {
    xloader: './src/index.js',
    test: './test/browser/index.js'
  },

  output: {
    library: 'xloader',
    path: pathUtil.join(__dirname, 'dist'),
    filename: '[name].js'
  },

  externals: {
    sinon: 'sinon'
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
