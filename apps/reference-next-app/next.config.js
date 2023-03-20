const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const { INTERNAL_API_URL = 'http://localhost:4444' } = process.env

const graphqlPath = '/api/graphql'

module.exports = withVanillaExtract({
  webpack: (config, options) => {
    return config
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    graphqlEndpoint: `${INTERNAL_API_URL}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    graphqlEndpoint: graphqlPath,
  },
  env: {
    API_MOCKS: process.env.API_MOCKS ?? '',
  },
})
