'use strict';


var pathUtil = require('path');


module.exports = {
  entry: './src/index.js',

  output: {
    library: 'butterfly',
    path: pathUtil.join(__dirname, 'dist'),
    filename: 'butterfly.js'
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
