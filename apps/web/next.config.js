const path = require('path')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StatoscopeWebpackPlugin = require('@statoscope/ui-webpack')
const { DuplicatesPlugin } = require('inspectpack/plugin')

const withVanillaExtract = createVanillaExtractPlugin()

// These modules need to be transpiled for IE11 support. This is not ideal,
// we should aim to drop IE11 support, or only use dependencies that have
// ES5 code (optionally plus ES6 module syntax).
const transpileModules = [
  'templite', // used by rosetta.
  '@sindresorhus/slugify',
  '@sindresorhus/transliterate', // Used by slugify.
  'escape-string-regexp', // Used by slugify.
]
const withTM = require('next-transpile-modules')(transpileModules)
const { API_URL = 'http://localhost:4444', SENTRY_DSN } = process.env
const graphqlPath = '/api/graphql'
const {
  DISABLE_API_CATALOGUE,
  DISABLE_SYSLUMENN_PAGE,
  DISABLE_ORGANIZATION_CHATBOT,
} = process.env

module.exports = withVanillaExtract(
  withTM(
    withHealthcheckConfig({
      webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }

        if (process.env.ANALYZE === 'true' && !isServer) {
          config.plugins.push(
            new DuplicatesPlugin({
              emitErrors: false,
              verbose: true,
            }),
          )

          config.plugins.push(
            new StatoscopeWebpackPlugin({
              saveTo: 'dist/apps/web/statoscope.html',
              saveStatsTo: 'dist/apps/web/stats.json',
              statsOptions: { all: true, source: false },
            }),
          )

          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: isServer
                ? '../analyze/server.html'
                : './analyze/client.html',
            }),
          )
        }

        const modules = path.resolve(__dirname, '../..', 'node_modules')

        config.resolve.alias = {
          ...(config.resolve.alias || {}),
          '@babel/runtime': path.resolve(modules, '@babel/runtime'),
          'bn.js': path.resolve(modules, 'bn.js'),
          'date-fns': path.resolve(modules, 'date-fns'),
          'es-abstract': path.resolve(modules, 'es-abstract'),
          'escape-string-regexp': path.resolve(modules, 'escape-string-regexp'),
          'readable-stream': path.resolve(modules, 'readable-stream'),
          'react-popper': path.resolve(modules, 'react-popper'),
          inherits: path.resolve(modules, 'inherits'),
          'graphql-tag': path.resolve(modules, 'graphql-tag'),
          'safe-buffer': path.resolve(modules, 'safe-buffer'),
          scheduler: path.resolve(modules, 'scheduler'),
        }

        return config
      },

      cssModules: false,

      serverRuntimeConfig: {
        // Will only be available on the server side
        // Requests made by the server are internal request made directly to the api hostname
        graphqlUrl: API_URL,
        graphqlEndpoint: graphqlPath,
      },

      publicRuntimeConfig: {
        // Will be available on both server and client
        graphqlUrl: '',
        graphqlEndpoint: graphqlPath,
        SENTRY_DSN,
        disableApiCatalog: DISABLE_API_CATALOGUE,
        disableSyslumennPage: DISABLE_SYSLUMENN_PAGE,
        disableOrganizationChatbot: DISABLE_ORGANIZATION_CHATBOT,
      },

      env: {
        API_MOCKS: process.env.API_MOCKS || '',
      },
    }),
  ),
)
