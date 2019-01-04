function escapeJs(source) {
  return source
    .replace(/\\/g, "\\\\")
    .replace(/\"/g, '\\"')
    .replace(/\'/g, "\\'");
}

module.exports = escapeJs;
