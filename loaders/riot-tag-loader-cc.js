const compiler = require("riot-compiler");
const { getOptions } = require("loader-utils");
const parseAttributes = require("./parseAttributes");
const escapeJs = require("./escapeJs");

/**
 * Generate the hmr code depending on the tags generated by the compiler
 * @param   { Array } tags - array of strings
 * @returns { string } the code needed to handle the riot hot reload
 */
function hotReload(tags) {
  // must sync with the definition in @riotjs/custom-components
  const COMPONENT_NAME_POSTFIX = "native-component";

  return `
  if (module.hot) {
    module.hot.accept()
    if (module.hot.data) {
      ${tags
        .map(tag => `riot.reload('${tag}-${COMPONENT_NAME_POSTFIX}')`)
        .join("\n")}
    }
  }`;
}

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

  // compile to generate entities
  const parts =
    compiler.compile(
      source,
      Object.assign(opts, {
        sourcemap: false,
        entities: true
      }),
      this.resourcePath
    ) || [];

  const defines = parts.map(function(part) {
    const imports = part.imports,
          js = part.js,
          tagName = part.tagName,
          css = escapeJs(part.css),
          html = escapeJs(part.html),
          attribs = parseAttributes(part.attribs),
          props = Object.keys(attribs).map(escapeJs).join("','"),
          data = JSON.stringify(attribs);

    return `
${imports}

const constructor = function () {
${js};
};

define('${tagName}', {
  css: '${css}',
  tmpl: '${html}',
  props: ['${props}'],
  data() {
    return ${data};
  }
}, constructor)`;
  });

  // generate the output code
  const output = `
import define from '@riotjs/custom-elements';

${defines.join("\n")}

${opts.hot ? hotReload(tags) : ""}
`;

  // cache this module
  if (this.cacheable) this.cacheable();

  // TODO: generate sourcemaps

  return output;
};
