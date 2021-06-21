const withTreat = require('next-treat')()
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')

const localhostApi = 'http://localhost:3333'

const { API_URL = localhostApi, INTERNAL_API_URL = localhostApi } = process.env

const apiPath = '/api'
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
      apiUrl: `${API_URL}${apiPath}`,
      graphqlEndpoint: `${INTERNAL_API_URL}${graphqlPath}`,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: apiPath,
      graphqlEndpoint: graphqlPath,
    },
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
    devIndicators: {
      autoPrerender: false,
    },
  }),
)
