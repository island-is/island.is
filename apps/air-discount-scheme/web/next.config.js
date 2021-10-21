const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withNx = require('@nrwl/next/plugins/with-nx')
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')

const {
  API_URL = 'http://localhost:4242',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  SENTRY_DSN,
} = process.env
const apiPath = '/api'
const graphqlPath = '/api/graphql'
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withNx(
  withVanillaExtract(
    withHealthcheckConfig({
      webpack: (config, options) => {
        if (!options.isServer) {
          config.resolve.alias['@sentry/node'] = '@sentry/browser'
        }

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
