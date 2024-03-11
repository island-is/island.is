// UPGRADE WARNING
// Copied from @nx/jest/plugins/resolver.ts v16.9.0 and converted to JS
// Removed .css extension override to support vanilla-extract.
// May need an update whenever @nx/jest changes.

const { dirname, extname, join } = require('path')
const { resolve: resolveExports } = require('resolve.exports')
const ts = require('typescript')

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
    ts = ts || require('typescript')
    compilerSetup = compilerSetup || getCompilerSetup(options.rootDir)
    const { compilerOptions, host } = compilerSetup
    return ts.resolveModuleName(
      path,
      join(options.basedir, 'fake-placeholder.ts'),
      compilerOptions,
      host,
    ).resolvedModule.resolvedFileName
  }
}
