const path = require('path')
const TreatPlugin = require('treat/webpack-plugin')

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
      '@island.is/island-ui/theme': path.resolve(__dirname, '../../theme/src'),
      '@island.is/island-ui/utils': path.resolve(__dirname, '../../utils/src'),
      '@island.is/shared/constants': path.resolve(
        __dirname,
        '../../../shared/constants/src',
      ),
    },
  }

  return config
}
