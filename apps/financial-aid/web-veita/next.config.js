const withNx = require('@nrwl/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const {
  API_URL = 'http://localhost:3339',
  WEB_PUBLIC_URL = 'http://localhost:4200',
} = process.env

const graphqlPath = '/api/graphql'
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withNx(
  withVanillaExtract({
    webpack: (config, options) => {
      // if (!options.isServer) {
      //   config.resolve.alias['@sentry/node'] = '@sentry/browser'
      // }
      return config
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      graphqlEndpoint: `${API_URL}${graphqlPath}`,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
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
