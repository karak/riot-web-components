function escapeJs(source) {
  return source
    .replace(/\\/g, "\\\\")
    .replace(/\"/g, '\\"')
    .replace(/\'/g, "\\'")
    .replace(/\n/g, '\\n')
}

module.exports = escapeJs;
