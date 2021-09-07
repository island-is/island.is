const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withSourceMaps = require('@zeit/next-source-maps')
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')
// const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const {
  API_URL = 'http://localhost:4242',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  SENTRY_DSN,
  // SENTRY_AUTH_TOKEN,
  NODE_ENV,
} = process.env
const apiPath = '/api'
const graphqlPath = '/api/graphql'
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withSourceMaps(
  withVanillaExtract(
    withHealthcheckConfig({
      webpack5: false,
      webpack: (config, options) => {
        if (!options.isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }

        // if (SENTRY_DSN && SENTRY_AUTH_TOKEN) {
        //   config.plugins.push(
        //     new SentryWebpackPlugin({
        //       include: '.next',
        //       ignore: ['node_modules'],
        //       urlPrefix: '~/_next',
        //       release: options.buildId,
        //     }),
        //   )
        // }

        return config
      },
      serverRuntimeConfig: {
        // Will only be available on the server side
        apiUrl: `${API_URL}${apiPath}`,
        graphqlEndpoint: `${API_URL}${graphqlPath}`,
      },
      publicRuntimeConfig: {
        // Will be available on both server and client
        apiUrl: `${WEB_PUBLIC_URL}/api`,
        SENTRY_DSN,
        graphqlEndpoint: graphqlPath,
      },
      env: {
        API_MOCKS: process.env.API_MOCKS || '',
      },
    }),
  ),
)
