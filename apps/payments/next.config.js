//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin()

const {
  API_URL = 'http://localhost:4444',
  CONFIGCAT_SDK_KEY,
  BASEPATH = '/greida',

  PAYMENTS_TOKEN_SIGNING_SECRET,
  PAYMENTS_TOKEN_SIGNING_ALGORITHM,
  PAYMENTS_TOKEN_SIGNATURE_PREFIX,
  PAYMENTS_API_SECRET,
  PAYMENTS_API_HEADER_KEY,
  PAYMENTS_API_HEADER_VALUE,
  PAYMENTS_GATEWAY_API_URL,
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
    paymentsTokenSigningSecret: PAYMENTS_TOKEN_SIGNING_SECRET,
    paymentsTokenSigningAlgorithm: PAYMENTS_TOKEN_SIGNING_ALGORITHM,
    paymentsTokenSignaturePrefix: PAYMENTS_TOKEN_SIGNATURE_PREFIX,
    paymentsApiSecret: PAYMENTS_API_SECRET,
    paymentsApiHeaderKey: PAYMENTS_API_HEADER_KEY,
    paymentsApiHeaderValue: PAYMENTS_API_HEADER_VALUE,
    paymentsGatewayApiUrl: PAYMENTS_GATEWAY_API_URL,
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
