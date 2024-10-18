const path = require('path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')

const libs = ['application/types']

const extraNodeModules = libs.reduce((acc, lib) => {
  acc[`@island.is/${lib}`] = path.resolve(__dirname, `../../../libs/${lib}/src`)
  return acc
}, {})

const watchFolders = [
  ...libs.map((lib) => path.resolve(__dirname, `../../../libs/${lib}/src`)),
]

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))]

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@ui': path.resolve(__dirname + '/src/ui'),
      ...extraNodeModules,
    },
    nodeModulesPaths,
  },
  watchFolders,
}

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
