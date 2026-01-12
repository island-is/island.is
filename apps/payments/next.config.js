//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin()

const {
  PAYMENTS_API_URL,
  API_INTERNAL_BASEPATH = 'http://localhost:4444',
  API_EXTERNAL_BASEPATH = 'http://localhost:4444',
  APP_EXTERNAL_BASEPATH = 'http://localhost:4200',
  CONFIGCAT_SDK_KEY,
  BASEPATH = '/greida',
  PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET,
} = process.env

const apiPath = '/api'
const graphqlPath = `${apiPath}/graphql`

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
    apiUrl: `${API_INTERNAL_BASEPATH}${apiPath}`,
    graphqlEndpoint: `${API_INTERNAL_BASEPATH}${graphqlPath}`,
    paymentApiEndpoint: PAYMENTS_API_URL,
    verificationCallbackSigningSecret:
      PAYMENTS_VERIFICATION_CALLBACK_SIGNING_SECRET,
    appExternalUrl: `${APP_EXTERNAL_BASEPATH}${BASEPATH}`,
  },
  publicRuntimeConfig: {
    graphqlEndpoint: `${API_EXTERNAL_BASEPATH}${graphqlPath}`,
    configCatSdkKey: CONFIGCAT_SDK_KEY,
    basepath: BASEPATH,
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
