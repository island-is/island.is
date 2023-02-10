const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const {
  BASE_PATH = '/app/skilavottord',
  API_URL = 'http://localhost:3333',
  API_PATH = '/app/skilavottord/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  DD_RUM_APPLICATION_ID,
  DD_RUM_CLIENT_TOKEN,
  APP_VERSION,
  ENVIRONMENT,
} = process.env

const graphqlPath = '/graphql'

module.exports = withVanillaExtract({
  webpack: (config, options) => {
    return config
  },
  serverRuntimeConfig: {
    graphqlEndpoint: `${API_URL}${API_PATH}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    graphqlEndpoint: `${API_PATH}${graphqlPath}`,
    ddRumApplicationId: DD_RUM_APPLICATION_ID,
    ddRumClientToken: DD_RUM_CLIENT_TOKEN,
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
})
