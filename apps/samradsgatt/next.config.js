// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const {
  API_URL = 'http://localhost:4242',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  NODE_ENV,

  APP_VERSION,
  ENVIRONMENT,
} = process.env
const apiPath = '/api'
const graphqlPath = '/api/graphql'
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withNx(
  withVanillaExtract({
    webpack: (config, options) => {
      return config
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: `${WEB_PUBLIC_URL}/api`,
      graphqlEndpoint: graphqlPath,

      appVersion: APP_VERSION,
      environment: ENVIRONMENT,
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: `${API_URL}${apiPath}`,
      graphqlEndpoint: `${API_URL}${graphqlPath}`,
    },
    basePath: '/samradsgatt',
    presets: ['next/babel'],
  }),
)
