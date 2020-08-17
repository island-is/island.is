const withTreat = require('next-treat')()
const withSourceMaps = require('@zeit/next-source-maps')
// const SentryWebpackPlugin = require('@sentry/webpack-plugin')

const {
  API_URL = 'http://localhost:3333/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  SENTRY_DSN,
  // SENTRY_AUTH_TOKEN,
  NODE_ENV,
} = process.env

module.exports = withSourceMaps(
  withTreat({
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser'
      }

      // if (SENTRY_DSN && SENTRY_AUTH_TOKEN) {
      //   config.plugins.push(
      //     new SentryWebpackPlugin({
      //       include: '.next',
      //       ignore: ['node_modules'],
      //       urlPrefix: '~/_next',
      //       release: options.buildId,
      //     }),
      //   )
      // }

      return config
    },
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: API_URL,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: `${WEB_PUBLIC_URL}/api`,
      SENTRY_DSN,
    },
  }),
)
