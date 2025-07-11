const { readFileSync } = require('fs')
const path = require('path')
const resolveSync = require('resolve').sync
const { parse } = require('@babel/parser')

const barf = (msg) => {
  throw new Error('exportFinder: ' + msg)
}

const resolve = (importPath, source) => {
  if (!importPath.startsWith('.')) {
    barf(
      `Could not resolve ${importPath} from ${source}. Import transformation only supports re-exports from relative paths.`,
    )
  }

  return resolveSync(importPath, {
    basedir: source,
    extensions: ['.tsx', '.ts', '.js', '.json'],
  })
}

const findExportedNames = (declaration) => {
  const names = []
  switch (declaration.type) {
    case 'VariableDeclaration':
      for (const declarator of declaration.declarations) {
        if (declarator.id.type === 'Identifier') {
          names.push(declarator.id.name)
        } else if (declarator.id.type === 'ObjectPattern') {
          for (const property of declarator.id.properties) {
            if (
              property.type === 'ObjectProperty' &&
              property.value.type === 'Identifier'
            ) {
              names.push(property.value.name)
            }
          }
        }
      }
      break
    case 'TSInterfaceDeclaration':
    case 'TSTypeAliasDeclaration':
    case 'FunctionDeclaration':
    case 'ClassDeclaration':
      if (declaration.id) {
        names.push(declaration.id.name)
      }
      break
  }
  return names
}

// eslint-disable-next-line func-style
function getExportDeclarations(ast, moduleDir) {
  const declarations = ast.program.body.filter(
    (node) =>
      node.type === 'ExportDefaultDeclaration' ||
      node.type === 'ExportNamedDeclaration' ||
      node.type === 'ExportAllDeclaration',
  )
  const exports = []

  declarations.forEach((node) => {
    if (node.type === 'ExportDefaultDeclaration') {
      exports.push({
        name: 'default',
      })
      return
    }
    const importPath = node.source
      ? resolve(node.source.value, moduleDir)
      : undefined

    if (node.type === 'ExportAllDeclaration') {
      exports.push({
        name: null,
        source: importPath,
      })
      return
    }

    node.specifiers.forEach((specifier) => {
      if (specifier.type === 'ExportNamespaceSpecifier') {
        // These are `export * as name from ...` declarations.
        //
        // We can't optimize these with `babel-plugin-transform-imports`.
        // Until we write our own transform plugin, we ignore these, as we
        // rather want to crash the build than import a huge index file in
        // production.
        return
      }
      // Is this used?
      if (
        specifier.type === 'ExportDefaultSpecifier' ||
        specifier.exported.type === 'StringLiteral'
      ) {
        return
      }
      if (importPath && specifier.exported.name !== specifier.local.name) {
        // These are `export { a as b } from ...` declarations.
        // They also don't work with `babel-plugin-transform-imports`.
        return
      }
      exports.push({
        name: specifier.exported.name,
        source: importPath,
        sourceName: importPath ? specifier.local.name : undefined,
      })
    })

    if (node.declaration) {
      const exportedNames = findExportedNames(node.declaration)
      exportedNames.forEach((name) => {
        exports.push({
          name,
        })
      })
    }
  })
  return exports
}

const getExports = (modulePath) => {
  const ast = parse(readFileSync(modulePath, 'utf-8'), {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  const moduleDir = path.dirname(modulePath)
  const exports = getExportDeclarations(ast, moduleDir)

  return exports
}

const visitModule = (
  modulePath,
  findName = null,
  originalName = null,
  stack = [],
  exportMap = {},
  fileCache = {},
) => {
  if (stack.includes(modulePath)) {
    barf(`Circular dependency: ${stack.concat(modulePath).join(' -> ')}`)
  }
  stack.push(modulePath)

  let exports = fileCache[modulePath]
  if (!exports) {
    exports = fileCache[modulePath] = getExports(modulePath)
  }

  // Reverse loop exports to easily skip duplicate exports.
  for (let i = exports.length - 1; i >= 0; i--) {
    const exportItem = exports[i]

    // Fast skip if it's a named export which does not match what we're looking for.
    if (findName && exportItem.name && findName !== exportItem.name) {
      continue
    }

    // Ignore default exports when not explicitly searching for it.
    if (!findName && exportItem.name === 'default' && stack.length > 1) {
      continue
    }

    // Ignore names that are already mapped.
    if (!findName && exportItem.name && exportMap[exportItem.name]) {
      continue
    }

    if (exportItem.source) {
      visitModule(
        exportItem.source,
        exportItem.sourceName || findName,
        originalName || exportItem.name,
        stack,
        exportMap,
        fileCache,
      )
    } else if (exportItem.name) {
      // Simple export definition. Mark it in the module map. Uses originalName
      // when it's being re-exported, otherwise the current export name.
      exportMap[originalName || exportItem.name] = modulePath
    }

    // Found what we're looking for. Exit early.
    if (originalName && exportMap[originalName]) {
      break
    }

    // Did not find something we were looking for.
    if (exportItem.name && !exportMap[exportItem.name]) {
      barf(
        `Could not find ${exportItem.name} exported from ${exportItem.source}.`,
      )
    }
  }

  stack.pop()

  return exportMap
}

const exportFinder = (mainPath) => {
  const exports = visitModule(path.resolve(mainPath))

  return exports
}

module.exports = exportFinder
