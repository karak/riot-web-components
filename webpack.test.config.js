const base = require('./webpack.config');

module.exports = Object.assign({}, base, {
  entry: null,
  output: null,
  devtool: 'source-map'
});
