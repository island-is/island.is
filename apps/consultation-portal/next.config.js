// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const {
  API_URL = 'http://localhost:4444',
  BASE_PATH = '/samradsgatt',
  APP_VERSION,
  ENVIRONMENT,
  CONFIGCAT_SDK_KEY,
  DD_LOGS_CLIENT_TOKEN,
} = process.env
const apiPath = '/api'
const graphqlPath = '/api/graphql'
const withVanillaExtract = createVanillaExtractPlugin()
module.exports = withNx(
  withVanillaExtract({
    webpack: (config, { isServer, dev }) => {
      if (process.env.ANALYZE === 'true' && !isServer) {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
          }),
        )
      }

      if (!dev && isServer) {
        config.devtool = 'source-map'
      }
      return config
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      graphqlUrl: '',
      graphqlEndpoint: graphqlPath,
      ddLogsClientToken: DD_LOGS_CLIENT_TOKEN,
      appVersion: APP_VERSION,
      environment: ENVIRONMENT,
      configCatSdkKey: CONFIGCAT_SDK_KEY,
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: `${API_URL}${apiPath}`,
      graphqlEndpoint: `${API_URL}${graphqlPath}`,
    },
    basePath: `${BASE_PATH}`,
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      IDENTITY_SERVER_SECRET: process.env.IDENTITY_SERVER_SECRET,
      IDENTITY_SERVER_ISSUER_DOMAIN: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
    },
  }),
)
