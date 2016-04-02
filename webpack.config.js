'use strict';


var pathUtil = require('path');


module.exports = {
  entry: {
    xloader: './lib/index.js',
    test: './test/browser/index.js'
  },

  output: {
    library: '[name]',
    path: pathUtil.join(__dirname, 'dist'),
    filename: '[name].js',
    devtoolModuleFilenameTemplate: '[resource-path]'
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
  },

  devtool: '#cheap-module-source-map'
};
