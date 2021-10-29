const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')

const {
  BASE_PATH = '/app/skilavottord',
  API_URL = 'http://localhost:3333',
  API_PATH = '/app/skilavottord/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  SENTRY_DSN,
} = process.env

const graphqlPath = '/graphql'

module.exports = withVanillaExtract(
  withHealthcheckConfig({
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }
      return config
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: `${API_URL}${API_PATH}`,
      graphqlEndpoint: `${API_URL}${API_PATH}${graphqlPath}`,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: `${WEB_PUBLIC_URL}${API_PATH}`,
      graphqlEndpoint: `${API_PATH}${graphqlPath}`,
      SENTRY_DSN,
    },
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
    basePath: `${BASE_PATH}`,
    async redirects() {
      return [
        {
          source: `${BASE_PATH}`,
          destination: '/',
          basePath: false,
          permanent: false,
        },
      ]
    },
  }),
)
