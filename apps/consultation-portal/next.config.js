// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const {
  API_URL = 'http://localhost:4444',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  NODE_ENV,
  DISABLE_API_CATALOGUE,
  DD_RUM_APPLICATION_ID,
  DD_RUM_CLIENT_TOKEN,
  APP_VERSION,
  ENVIRONMENT,
  CONFIGCAT_SDK_KEY,
} = process.env
const apiPath = '/api'
const graphqlPath = '/api/graphql'
const withVanillaExtract = createVanillaExtractPlugin()
const path = process.env.NODE_ENV === 'production' ? '/samradsgatt' : ''
module.exports = withNx(
  withVanillaExtract({
    webpack: (config, options) => {
      return config
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      graphqlUrl: '',
      graphqlEndpoint: graphqlPath,
      appVersion: APP_VERSION,
      environment: ENVIRONMENT,
      configCatSdkKey: CONFIGCAT_SDK_KEY,
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: `${API_URL}${apiPath}`,
      graphqlEndpoint: `${API_URL}${graphqlPath}`,
    },
    basePath: path,
    presets: ['next/babel'],
    env: {
      WEB_PUBLIC_URL: 'http://localhost:4200/consultation-portal' || '',
    },
  }),
)
