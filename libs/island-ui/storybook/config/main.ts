import type { StorybookConfig } from '@storybook/react-webpack5'
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin'
import path, { dirname, join } from 'path'

const rootDir = (dir: string) => path.resolve(__dirname, dir)

const config: StorybookConfig = {
  typescript: {
    reactDocgen: false,
  },
  stories: [
    '../../core/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../application/ui-fields/src/lib/AsGuide.mdx',
    '../../../application/ui-fields/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../application/ui-components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('storybook-addon-apollo-client'),
    getAbsolutePath('@storybook/addon-essentials'),
  ],
  babel: (options: any) => ({
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

    // Add Node.js polyfills for Webpack 5
    config.resolve = {
      ...config.resolve,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      fallback: {
        ...config.resolve?.fallback,
        tty: require.resolve('tty-browserify'),
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      },
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
        '@island.is/react-spa/bff': rootDir('../../../react-spa/bff/src'),
        '@island.is/auth/scopes': rootDir('../../../auth/scopes/src'),
      },
    }

    // Configure babel-loader for all TypeScript and JavaScript files
    const babelRule = {
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: path.resolve(__dirname, '../../../../node_modules'),
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-transform-private-methods',
              '@babel/plugin-transform-private-property-in-object',
            ],
          },
        },
      ],
    }

    // Replace or add the babel rule
    if (config.module?.rules) {
      const existingBabelRuleIndex = config.module.rules.findIndex(
        (rule: any) =>
          rule.test && rule.test.toString().includes('ts|tsx|js|jsx'),
      )

      if (existingBabelRuleIndex !== -1) {
        config.module.rules[existingBabelRuleIndex] = babelRule
      } else {
        config.module.rules.unshift(babelRule)
      }
    }

    // Add source loader for story files (after babel processing)
    config.module?.rules?.push({
      test: /\.stories\.(ts|tsx)$/,
      exclude: path.resolve(__dirname, '../../../../node_modules'),
      use: [
        {
          loader: '@storybook/source-loader',
          options: {
            injectParameters: true,
          },
        },
      ],
    })

    return config
  },
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {},
  },
  docs: {
    autodocs: true,
  },
}

export default config

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
