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
  ALLOW_APPLE_PAY,
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
  webpack: (config, { dev }) => {
    // Workaround for Firefox "unterminated comment" when loading vanilla-extract
    // global.css (gzip+base64 in magic comments). Shorten those comments in dev
    // so Firefox's parser doesn't choke (Firefox-only, dev-only bug).
    if (dev) {
      config.optimization = config.optimization || {}
      config.optimization.moduleIds = 'deterministic'
      config.output = config.output || {}
      config.output.pathinfo = false
      config.plugins = config.plugins || []
    }
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
    allowApplePay: ALLOW_APPLE_PAY || 'false',
  },
  basePath: `${BASEPATH}`,
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
