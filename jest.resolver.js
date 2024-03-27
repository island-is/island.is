// UPGRADE WARNING
// Copied from @nx/jest/plugins/resolver.ts v16.9.0 and converted to JS
// Removed .css extension override to support vanilla-extract.
// May need an update whenever @nx/jest changes.

const { dirname, extname, join } = require('path')
const { resolve: resolveExports } = require('resolve.exports')
const ts = require('typescript')
const { readProjectConfiguration, workspaceRoot } = require('@nx/devkit')
/**
 * Nx UPGRADE WARNING - Nx 16.3.2:
 * This is a direct import as the FsTree is not a public API of Nx.
 * We are using FsTree to find the project configuration to read the project root.
 * This may break in future versions of Nx.
 */
const { FsTree } = require('nx/src/generators/tree')

let compilerSetup

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
    dirname(tsConfigPath),
  )
  const compilerOptions = config.options
  const host = ts.createCompilerHost(compilerOptions, true)
  return { compilerOptions, host }
}

module.exports = function (path, options) {
  const ext = extname(path)
  if (
    ext === '.scss' ||
    ext === '.sass' ||
    ext === '.less' ||
    ext === '.styl'
  ) {
    return require.resolve('identity-obj-proxy')
  }
  try {
    try {
      // Try to use the defaultResolver with default options
      return options.defaultResolver(path, options)
    } catch {
      // Try to use the defaultResolver with a packageFilter
      return options.defaultResolver(path, {
        ...options,
        packageFilter: (pkg) => ({
          ...pkg,
          main: pkg.main || pkg.es2015 || pkg.module,
        }),
        pathFilter: (pkg) => {
          if (!pkg.exports) {
            return path
          }

          return resolveExports(pkg, path) || path
        },
      })
    }
  } catch (e) {
    if (
      path === 'jest-sequencer-@jest/test-sequencer' ||
      path === '@jest/test-sequencer'
    ) {
      return
    }
    // Fallback to using typescript
    // UPGRADE WARNING
    // Our modification made to the v16.9.0
    // Adding usage of FsTree and readProjectConfiguration
    const fsTree = new FsTree(workspaceRoot, false)
    const project = readProjectConfiguration(
      fsTree,
      process.env.NX_TASK_TARGET_PROJECT,
    )

    compilerSetup =
      compilerSetup ||
      getCompilerSetup(
        // UPGRADE WARNING
        // Appending project root to find the projects tsconfig.spec.json file
        (options.rootDir ?? options.basedir) + `/${project.root}`,
      )
    const { compilerOptions, host } = compilerSetup
    return ts.resolveModuleName(
      path,
      join(options.basedir, 'fake-placeholder.ts'),
      compilerOptions,
      host,
    ).resolvedModule.resolvedFileName
  }
}
