import { withNxMetro } from '@nrwl/react-native'
import { getDefaultConfig } from 'metro-config'

import exclusionList from 'metro-config/src/defaults/exclusionList'
import path from 'path'

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig()
  const config = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      blockList: exclusionList([/^(?!.*node_modules).*\/dist\/.*/]),
      extraNodeModules: {
        '@ui': path.resolve(__dirname + '/src/ui'),
      },
    },
  }
  return await withNxMetro(config, {
    debug: false,
    extensions: [],
    projectRoot: __dirname,
    watchFolders: [],
  })
})()
