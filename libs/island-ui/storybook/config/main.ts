import type { StorybookConfig } from '@storybook/react-webpack5'
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin'
import path from 'path'

const rootDir = (dir: string) => path.resolve(__dirname, dir)

const config: StorybookConfig = {
  typescript: {
    reactDocgen: false,
  },
  stories: [
    '../../core/src/**/*.stories.@(tsx|mdx)',
    '../../../application/ui-fields/src/lib/AsGuide.stories.mdx',
    '../../../application/ui-fields/**/*.stories.@(tsx|mdx)',
    '../../../application/ui-components/**/*.stories.@(tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    'storybook-addon-apollo-client',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-essentials',
  ],
  babel: (options) => ({
    ...options,
    presets: [
      '@babel/preset-env',
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
        'preset-react-jsx-transform',
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      '@babel/plugin-transform-class-properties',
      '@babel/plugin-transform-private-methods',
      '@babel/plugin-transform-private-property-in-object',
    ],
  }),
  webpackFinal: (config) => {
    config.plugins?.push(new VanillaExtractPlugin())
    config.devtool = false
    config.module?.rules?.push({
      test: /\.stories\.(ts|tsx)$/,
      exclude: path.resolve(__dirname, '../../../../node_modules'),
      use: [
        {
          // needed for docs addon
          loader: '@storybook/source-loader',
          options: {
            injectParameters: true,
          },
        },
      ],
    })
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        '@island.is/island-ui/core': rootDir('../../core/src'),
        '@island.is/island-ui/theme': rootDir('../../theme/src'),
        '@island.is/island-ui/utils': rootDir('../../utils/src'),
        '@island.is/island-ui/vanilla-extract-utils': rootDir(
          '../../vanilla-extract-utils/src',
        ),
        '@island.is/application/core': rootDir('../../../application/core/src'),
        '@island.is/application/types': rootDir(
          '../../../application/types/src',
        ),
        '@island.is/application/graphql': rootDir(
          '../../../application/graphql/src',
        ),
        '@island.is/application/ui-components': rootDir(
          '../../../application/ui-components/src',
        ),
        '@island.is/auth/react': rootDir('../../../auth/react/src'),
        '@island.is/shared/constants': rootDir('../../../shared/constants/src'),
        '@island.is/shared/form-fields': rootDir(
          '../../../shared/form-fields/src',
        ),
        '@island.is/shared/problem': rootDir('../../../shared/problem/src'),
        '@island.is/shared/utils': rootDir('../../../shared/utils/src'),
        '@island.is/shared/translations': rootDir(
          '../../../shared/translations/src',
        ),
        '@island.is/shared/types': rootDir('../../../shared/types/src'),
        '@island.is/shared/components': rootDir(
          '../../../shared/components/src',
        ),
        '@island.is/localization': rootDir('../../../localization/src'),
        '@island.is/react/components': rootDir('../../../react/components/src'),
        '@island.is/react/feature-flags': rootDir(
          '../../../react/feature-flags/src',
        ),
        '@island.is/feature-flags': rootDir('../../../feature-flags/src'),
        '@island.is/react-spa/shared': rootDir('../../../react-spa/shared/src'),
      },
    }
    return config
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: true,
  },
}

export default config
