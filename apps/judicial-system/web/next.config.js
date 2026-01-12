const { composePlugins, withNx } = require('@nx/next')

const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const { INTERNAL_API_URL = 'http://localhost:3333' } = process.env

const apiPath = '/api'
const graphqlPath = '/api/graphql'

const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    if (!dev && isServer) {
      config.devtool = 'source-map'
    }
    // Important: return the modified config
    return config
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: `${INTERNAL_API_URL}${apiPath}`,
    graphqlEndpoint: `${INTERNAL_API_URL}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: apiPath,
    graphqlEndpoint: graphqlPath,
    supportEmail: process.env.SUPPORT_EMAIL ?? 'ben10@omnitrix.is',
  },
  env: {
    API_MOCKS: process.env.API_MOCKS ?? '',
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
