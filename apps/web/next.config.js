const path = require('path')
const { IgnorePlugin } = require('webpack')
const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default
const { DuplicatesPlugin } = require('inspectpack/plugin')

const graphqlPath = '/api/graphql'
const {
  API_URL = 'http://localhost:4444',
  DISABLE_API_CATALOGUE,
  DD_LOGS_CLIENT_TOKEN,
  APP_VERSION,
  ENVIRONMENT,
  CONFIGCAT_SDK_KEY,
} = process.env

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Optimize barrel file imports (replaces babel-plugin-transform-imports)
  experimental: {
    optimizePackageImports: [
      '@island.is/island-ui/core',
      '@island.is/island-ui/contentful',
      '@island.is/web/components',
      'lodash',
      'date-fns',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/umsoknir/:slug',
        destination: 'https://island.is/umsoknir/:slug',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
      {
        source: '/opinbernyskopun/rss.xml',
        destination: '/api/rss/opinbernyskopun',
      },
      {
        source: '/rss/domar',
        destination: '/api/domar/rss',
      },
      {
        source: '/rss/domar.xml',
        destination: '/api/domar/rss',
      },
      {
        source: '/rss/dagskra-domstola',
        destination: '/api/dagskra-domstola/rss',
      },
      {
        source: '/rss/dagskra-domstola.xml',
        destination: '/api/dagskra-domstola/rss',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/en/organizations',
        destination: '/en/o',
        permanent: true,
      },
      {
        source: '/en/organizations/:slug',
        destination: '/en/o/:slug',
        permanent: true,
      },
      {
        source: '/en/organizations/:slug/:subSlug',
        destination: '/en/o/:slug/:subSlug',
        permanent: true,
      },
      {
        source: '/stofnanir',
        destination: '/s',
        permanent: true,
      },
      {
        source: '/s/haskolanam',
        destination: '/haskolanam',
        permanent: true,
      },
      {
        source: '/en/o/university-studies',
        destination: '/university-studies',
        permanent: true,
      },
      {
        source: '/stofnanir/:slug',
        destination: '/s/:slug',
        permanent: true,
      },
      {
        source: '/stofnanir/:slug/:subSlug',
        destination: '/s/:slug/:subSlug',
        permanent: true,
      },
      {
        source: '/handbaekur',
        destination: '/leit?q=*&type=webManual',
        permanent: true,
      },
      {
        source: '/en/manuals',
        destination: '/en/search?q=*&type=webManual',
        permanent: true,
      },
      {
        source: '/en/o/icelandic-health-insurance',
        destination: '/en/o/iceland-health',
        permanent: true,
      },
      {
        source: '/en/help/icelandic-health-insurance',
        destination: '/en/help/iceland-health',
        permanent: true,
      },
      {
        source: '/en/o/icelandic-health-insurance/:subSlug*',
        destination: '/en/o/iceland-health/:subSlug*',
        permanent: true,
      },
      {
        source: '/en/help/icelandic-health-insurance/:subSlug*',
        destination: '/en/help/iceland-health/:subSlug*',
        permanent: true,
      },
      {
        source: '/adstod/tryggingastofnun/hafa-samband',
        destination: 'https://minarsidur.tr.is/hafa-samband',
        permanent: true,
      },
      {
        source: '/en/help/social-insurance-administration/contact-us',
        destination: 'https://minarsidur.tr.is/hafa-samband',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source:
          '/.well-known/apple-developer-merchantid-domain-association.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer, dev }) => {
    if (process.env.ANALYZE === 'true' && !isServer) {
      config.plugins.push(
        new DuplicatesPlugin({
          emitErrors: false,
          verbose: true,
        }),
      )

      config.plugins.push(
        new StatoscopeWebpackPlugin({
          saveTo: 'dist/apps/web/statoscope.html',
          saveStatsTo: 'dist/apps/web/stats.json',
          statsOptions: { all: true, source: false },
        }),
      )

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        }),
      )
    }

    if (!isServer) {
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^@island.is\/clients\/middlewares$/,
        }),
      )
    }

    if (!dev && isServer) {
      config.devtool = 'source-map'
    }

    const modules = path.resolve(__dirname, '../..', 'node_modules')

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@babel/runtime': path.resolve(modules, '@babel/runtime'),
      'bn.js': path.resolve(modules, 'bn.js'),
      'date-fns': path.resolve(modules, 'date-fns'),
      'es-abstract': path.resolve(modules, 'es-abstract'),
      'escape-string-regexp': path.resolve(modules, 'escape-string-regexp'),
      'readable-stream': path.resolve(modules, 'readable-stream'),
      'react-popper': path.resolve(modules, 'react-popper'),
      inherits: path.resolve(modules, 'inherits'),
      'graphql-tag': path.resolve(modules, 'graphql-tag'),
      'safe-buffer': path.resolve(modules, 'safe-buffer'),
      scheduler: path.resolve(modules, 'scheduler'),
    }

    return config
  },

  serverRuntimeConfig: {
    // Will only be available on the server side
    // Requests made by the server are internal request made directly to the api hostname
    graphqlUrl: API_URL,
    graphqlEndpoint: graphqlPath,
  },

  publicRuntimeConfig: {
    // Will be available on both server and client
    graphqlUrl: '',
    graphqlEndpoint: graphqlPath,
    disableApiCatalog: DISABLE_API_CATALOGUE,
    ddLogsClientToken: DD_LOGS_CLIENT_TOKEN,
    appVersion: APP_VERSION,
    environment: ENVIRONMENT,
    configCatSdkKey: CONFIGCAT_SDK_KEY,
  },

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
