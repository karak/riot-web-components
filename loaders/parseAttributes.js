var cheerio = require('cheerio');

/**
 *  Parse attributes string.
 *
 *  @param {String} attributes attribute part of an HTML tag.
 *  @returns {Object} attributes object.
 */
function parseAttributes(attributes) {
  var tag = '<br ' + attributes + '>';
  var $ = cheerio.load(tag);

  return $('body').children().first().attr() || {};
}

module.exports = parseAttributes;
