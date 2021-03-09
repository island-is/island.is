const withTreat = require('next-treat')()
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')

const {
  API_URL = 'http://localhost:3333',
  API_PATH = '/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
} = process.env
const graphqlPath = '/api/graphql'

module.exports = withTreat(
  withHealthcheckConfig({
    webpack: (config, options) => {
      // if (!options.isServer) {
      //   config.resolve.alias['@sentry/node'] = '@sentry/browser'
      // }
      return config
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: API_URL,
      graphqlEndpoint: graphqlPath,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: `${WEB_PUBLIC_URL}${API_PATH}`,
      graphqlEndpoint: graphqlPath,
    },
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
  }),
)
