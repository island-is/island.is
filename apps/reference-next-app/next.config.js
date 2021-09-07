const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const {
  API_URL = 'http://localhost:3333/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
} = process.env

module.exports = withVanillaExtract({
  webpack5: false,
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }
    return config
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: API_URL,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: `${WEB_PUBLIC_URL}/api`,
  },
})
