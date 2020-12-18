const withTreat = require('next-treat')()
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')

const {
  API_URL = 'http://localhost:3333',
  API_PATH = '/skilavottord/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  SENTRY_DSN,
} = process.env

const graphqlPath = '/graphql'

module.exports = withTreat(
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
    basePath: '/skilavottord',
    async redirects() {
      return [
        {
          source: '/skilavottord',
          destination: '/',
          basePath: false,
          permanent: false,
        },
      ]
    },
  }),
)
