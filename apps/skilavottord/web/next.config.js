const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const { withNx, composePlugins } = require('@nx/next')
const withVanillaExtract = createVanillaExtractPlugin()

const {
  BASE_PATH = '/app/skilavottord',
  API_URL = 'http://localhost:3333',
  API_PATH = '/app/skilavottord/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  DD_LOGS_CLIENT_TOKEN,
  APP_VERSION,
  ENVIRONMENT,
} = process.env

const graphqlPath = '/graphql'

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!dev && isServer) {
      config.devtool = 'source-map'
    }
    return config
  },
  serverRuntimeConfig: {
    graphqlEndpoint: `${API_URL}${API_PATH}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    graphqlEndpoint: `${API_PATH}${graphqlPath}`,
    ddRumClientToken: DD_LOGS_CLIENT_TOKEN,
    appVersion: APP_VERSION,
    environment: ENVIRONMENT,
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
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
