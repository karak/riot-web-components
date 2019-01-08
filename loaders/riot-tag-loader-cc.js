const { compile } = require("@riotjs/compiler");

const { getOptions } = require("loader-utils");

module.exports = function(source) {
  // tags collection
  const tags = [];

  // parse the user query
  const query = getOptions(this) || {};

  // normalise the query object in case of question marks
  const opts = Object.keys(query).reduce(function(acc, key) {
    acc[key.replace("?", "")] = query[key];
    return acc;
  }, {});

  // cache this module
  if (this.cacheable) this.cacheable();

  // compile to generate entities
  const callback = this.async();
  compile(source, opts).then(({ code, map }) => {
    callback(null, code, map);
  }).catch(err => {
    callback(err);
  });
};
