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
  module: {
    rules: [
      {
        test: /hello\.riot$/,
        loader: 'riot-compiler-loader',
        enforce: 'pre',
        options: {
          // disable riot own ScopedCSS for Shadow DOM.
          scopedCss: false,
          hot: true
        }
      },
      {
        test: /\.riot$/,
        exclude: /node_modules|hello.riot/,
        loader: 'riot-compiler-loader',
        enforce: 'pre',
        options: {
          hot: true
        }
      },
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  }
};
