const memoize = require('lodash/memoize')
const path = require('path')
const { workspaceRoot } = require('@nx/devkit')

const exportFinder = require('./export-finder')

const exportFinderCached = memoize(exportFinder)

const defaultMainPath = (libName) =>
  path.resolve(
    workspaceRoot,
    'libs',
    ...libName.replace('@island.is/', '').split('/'),
    'src',
    'index.ts',
  )

const transformLib = (libName, mainPath = defaultMainPath(libName)) => {
  const exports = exportFinderCached(mainPath)
  const transforms = Object.keys(exports).reduce((acc, exportName) => {
    acc[`${exportName}`] = exports[exportName]
    return acc
  }, {})

  return {
    [libName]: {
      transform: transforms,
      preventFullImport: true,
      skipDefaultConversion: true,
    },
  }
}

module.exports = transformLib
