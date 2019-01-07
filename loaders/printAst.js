const { nodeTypes } = require('@riotjs/parser');

/**
 * @Object Node
 * @param {Number} type
 * @param {Number} start
 * @param {Number} end
 * @param {Array<Node>} nodes
 */

/**
 * @param {String} data original tag
 * @param {Array<Node> | Node} nodes
 * @returns {String} HTML fragment
 *
 * @see @riotjs/parser test/builder/html-builder.js
 */
function printAst(data, node) {
  if (Array.isArray(node)) {
    return node.map(x => printAst(data, x)).join('\n');
  }

  return data.substring(node.start, node.end);
}

module.exports = printAst;
