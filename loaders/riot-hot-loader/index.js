const transform = require('./transform');

// const { getOptions } = require('loader-utils');
module.exports = function(source, inputSourceMap, meta) {
  // production mode
  if (process.env.NODE_ENV === 'production') {
    return this.callback(null, source, inputSourceMap, meta);
  }

  // development mode

  if (this.cacheable) {
    this.cacheable();
  }

  // const options = getOptions(this);

  const { code, map } = transform(source, inputSourceMap, this.resourcePath);

  this.callback(null, code, map, meta);
};
