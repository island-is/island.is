const path = require('path')
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin')

const rootDir = (dir) => path.resolve(__dirname, dir)

module.exports = {
  typescript: { reactDocgen: false },
  core: {
    builder: 'webpack5',
  },
  stories: [
    '../../core/src/**/*.stories.@(tsx|mdx)',
    '../../../application/ui-fields/src/lib/AsGuide.stories.mdx',
    '../../../application/ui-fields/**/*.stories.@(tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    'storybook-addon-designs',
  ],
  babel: async (options) => ({
    ...options,
    presets: [
      ['@babel/preset-env', { loose: true }],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
  }),
  webpackFinal: (config) => {
    config.plugins.push(new VanillaExtractPlugin())
    config.devtool = false

    config.module.rules.push({
      test: /\.stories\.(ts|tsx)$/,
      exclude: path.resolve(__dirname, '../../../../node_modules'),
      use: [
        {
          // needed for docs addon
          loader: '@storybook/source-loader',
          options: { injectParameters: true },
        },
      ],
    })

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@island.is/island-ui/core': rootDir('../../core/src'),
        '@island.is/island-ui/theme': rootDir('../../theme/src'),
        '@island.is/island-ui/utils': rootDir('../../utils/src'),
        '@island.is/island-ui/vanilla-extract-utils': rootDir(
          '../../vanilla-extract-utils/src',
        ),
        '@island.is/application/core': rootDir('../../../application/core/src'),
        '@island.is/application/graphql': rootDir(
          '../../../application/graphql/src',
        ),
        '@island.is/auth/react': rootDir('../../../auth/react/src'),
        '@island.is/shared/constants': rootDir('../../../shared/constants/src'),
        '@island.is/shared/form-fields': rootDir(
          '../../../shared/form-fields/src',
        ),
        '@island.is/localization': rootDir('../../../localization/src'),
      },
    }

    return config
  },
}
