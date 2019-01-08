const path = require('path');
const recast = require('recast');

const n = recast.types.namedTypes; // alias
const b = recast.types.builders;

/***
 * prepend `import hot from '...';`
 * @param ast
 * @param resourcePath
 */
function addImportHot(ast, resourcePath) {
  const hotModulePath = path.join(path.relative(path.dirname(resourcePath), __dirname), './hot.js');
  const importDeclaration = b.importDeclaration(
    [b.importDefaultSpecifier(b.identifier('hot'))],
    b.literal(hotModulePath)
  );
  const statements = ast.program.body;
  statements.splice(0, 0, importDeclaration);
}
/***
 * Rewrite `export default { ... }` => `export default hot(module)({ ... })`
 *
 * @param ast
 */
function wrapExportDeclarationByHot(ast) {
  const exportDefault = ast.program.body.find(n.ExportDefaultDeclaration.check);

  if (exportDefault) {
    exportDefault.declaration = b.callExpression(
      b.callExpression(b.identifier('hot'), [b.identifier('module')]),
      [exportDefault.declaration]
    );
  }
}

module.exports = function transform(source, inputSourceMap, resourcePath) {
  // parse
  const ast = recast.parse(source, { inputSourceMap, sourceFileName: resourcePath });

  // apply two manipulations
  addImportHot(ast, resourcePath);
  wrapExportDeclarationByHot(ast);

  // print
  const { code, map } = recast.print(ast);

  return { code, map };
}
