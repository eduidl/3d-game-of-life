const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: path.resolve('src/index.js'),

  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'main.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          query: {
            presets: ['env']
          }
        }],
      }
    ]
  },

  resolve: {
    extensions: ['.js']
  }
};
