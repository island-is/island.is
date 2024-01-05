/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path')
const { mergeConfig } = require('metro-config')

const libs = ['application/types']

const extraNodeModules = libs.reduce((acc, lib) => {
  acc[`@island.is/${lib}`] = path.resolve(__dirname, `../../../libs/${lib}/src`)
  return acc
}, {})

const watchFolders = [
  ...libs.map((lib) => path.resolve(__dirname, `../../../libs/${lib}/src`)),
]

const nodeModulesPaths = [path.resolve(path.join(__dirname, './node_modules'))]

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    extraNodeModules: {
      '@ui': path.resolve(__dirname + '/src/ui'),
      ...extraNodeModules,
    },
    nodeModulesPaths,
  },
  watchFolders,
}

module.exports = mergeConfig(config)
