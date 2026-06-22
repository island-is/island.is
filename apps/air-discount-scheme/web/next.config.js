const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const {
  API_URL = 'http://localhost:4242',
  WEB_PUBLIC_URL = 'http://localhost:4200',
  NODE_ENV,
  DD_LOGS_CLIENT_TOKEN,
  APP_VERSION,
  ENVIRONMENT,
} = process.env
const apiPath = '/api'
const graphqlPath = '/api/graphql'
const withVanillaExtract = createVanillaExtractPlugin()

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!dev && isServer) {
      config.devtool = 'source-map'
    }
    // @nx/next 22 dropped its built-in SVGR handling. Restore it explicitly so
    // the named-export style `import { ReactComponent as X } from './x.svg'`
    // (used in components/Layout) keeps resolving to a React component.
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options: {
            svgo: false,
            titleProp: true,
            ref: true,
            exportType: 'named',
            namedExport: 'ReactComponent',
          },
        },
      ],
    })
    return config
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: `${API_URL}${apiPath}`,
    graphqlEndpoint: `${API_URL}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: `${WEB_PUBLIC_URL}/api`,
    graphqlEndpoint: graphqlPath,
    ddLogsClientToken: DD_LOGS_CLIENT_TOKEN,
    appVersion: APP_VERSION,
    environment: ENVIRONMENT,
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
