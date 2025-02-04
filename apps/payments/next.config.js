//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin()

const {
  PAYMENTS_API_URL,
  API_URL = 'http://localhost:4444',
  CONFIGCAT_SDK_KEY,
  BASEPATH = '/greida',
  PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET = '',
} = process.env

const graphqlPath = '/api/graphql'

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: false,
  },
  webpack: (config, options) => {
    return config
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    graphqlEndpoint: `${API_URL}${graphqlPath}`,
    paymentApiEndpoint: PAYMENTS_API_URL,
    verificationCallbackSigningSecret:
      PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    graphqlEndpoint: graphqlPath,
    configCatSdkKey: CONFIGCAT_SDK_KEY,
  },
  basePath: `${BASEPATH}`,
  env: {
    API_MOCKS: process.env.API_MOCKS || '',
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
