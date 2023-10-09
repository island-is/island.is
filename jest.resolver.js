// UPGRADE WARNING
// Copied from @nx/jest/plugins/resolver.js v11.4.0
// Removed .css extension override to support vanilla-extract.
// May need an update whenever @nx/jest changes.

const path_1 = require('path')
const fs = require('fs')
const ts = require('typescript')
const defaultResolver_1 = require('jest-resolve/build/defaultResolver')
const { readProjectConfiguration, workspaceRoot } = require('@nx/devkit')
/**
 * Nx UPGRADE WARNING - Nx 16.3.2:
 * This is a direct import as the FsTree is not a public API of Nx.
 * We are using FsTree to find the project configuration to read the project root.
 * This may break in future versions of Nx.
 */
const { FsTree } = require('nx/src/generators/tree')

function getCompilerSetup(rootDir) {
  const tsConfigPath =
    ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.spec.json') ||
    ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.test.json') ||
    ts.findConfigFile(rootDir, ts.sys.fileExists, 'tsconfig.jest.json')
  if (!tsConfigPath) {
    console.error(
      `Cannot locate a tsconfig.spec.json. Please create one at ${rootDir}/tsconfig.spec.json`,
    )
  }
  const readResult = ts.readConfigFile(tsConfigPath, ts.sys.readFile)
  const config = ts.parseJsonConfigFileContent(
    readResult.config,
    ts.sys,
    path_1.dirname(tsConfigPath),
  )
  const compilerOptions = config.options
  const host = ts.createCompilerHost(compilerOptions, true)
  return { compilerOptions, host }
}

let compilerSetup
module.exports = function (path, options) {
  const ext = path_1.extname(path)
  if (
    ext === '.scss' ||
    ext === '.sass' ||
    ext === '.less' ||
    ext === '.styl'
  ) {
    return require.resolve('identity-obj-proxy')
  }
  // Try to use the defaultResolver
  try {
    return defaultResolver_1.default(path, options)
  } catch (e) {
    // Fallback to using typescript
    const fsTree = new FsTree(workspaceRoot, false)
    const project = readProjectConfiguration(
      fsTree,
      process.env.NX_TASK_TARGET_PROJECT,
    )

    compilerSetup =
      compilerSetup ||
      getCompilerSetup(
        (options.rootDir ?? options.basedir) + `/${project.root}`,
      )
    const { compilerOptions, host } = compilerSetup
    return ts.resolveModuleName(path, options.basedir, compilerOptions, host)
      .resolvedModule.resolvedFileName
  }
}
