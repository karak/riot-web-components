const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  resolveLoader: {
    modules: ['node_modules', path.join(__dirname, 'loaders')]
  },
  module: {
    rules: [
      { test: /\.riot$/, loader: 'riot-tag-loader-cc', enforce: 'pre', options: { hot: true } },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader'}
    ]
  }
};
