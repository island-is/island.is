const path = require('path')
const TreatPlugin = require('treat/webpack-plugin')

const rootDir = (dir) => path.resolve(__dirname, dir)

// Export a function. Accept the base config as the only param.
module.exports = async ({ config }) => {
  config.plugins.push(new TreatPlugin())
  config.resolve.extensions.push('.tsx', '.ts')
  config.devtool = false

  config.module.rules.push(
    {
      test: /\.(ts|tsx)$/,
      exclude: [
        path.resolve(__dirname, '../../../../node_modules'),
        path.resolve(__dirname, '../../core/src/lib/IconRC/icons'),
      ],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      ],
    },
    {
      test: /\.stories\.(ts|tsx)$/,
      exclude: path.resolve(__dirname, '../../../../node_modules'),
      use: [
        {
          // needed for docs addon
          loader: '@storybook/source-loader',
          options: { injectParameters: true },
        },
      ],
    },
  )

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@island.is/island-ui/core': rootDir('../../core/src'),
      '@island.is/island-ui/theme': rootDir('../../theme/src'),
      '@island.is/island-ui/utils': rootDir('../../utils/src'),
      '@island.is/application/core': rootDir('../../../application/core/src'),
      '@island.is/application/graphql': rootDir(
        '../../../application/graphql/src',
      ),
      '@island.is/shared/form-fields': rootDir(
        '../../../shared/form-fields/src',
      ),
      '@island.is/localization': rootDir('../../../localization/src'),
    },
  }

  return config
}
