const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const {
  INTERNAL_API_URL = 'http://localhost:4444',
  BFF_PROXY_TARGET = 'http://localhost:4444',
} = process.env

const graphqlPath = '/api/graphql'

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!dev && isServer) {
      config.devtool = 'source-map'
    }
    return config
  },
  serverRuntimeConfig: {
    graphqlEndpoint: `${INTERNAL_API_URL}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    graphqlEndpoint: graphqlPath,
  },
  async rewrites() {
    return [
      {
        source: '/bff/:path*',
        destination: `${BFF_PROXY_TARGET}/bff/:path*`,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '',
  nx: {
    svgr: false,
  },
}

const plugins = [withNx, withVanillaExtract]

module.exports = composePlugins(...plugins)(nextConfig)
