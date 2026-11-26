const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const { BASE_PATH = '/samradsgatt' } = process.env
const withVanillaExtract = createVanillaExtractPlugin()
module.exports = withNx(
  withVanillaExtract({
    // Next 16.4 type-checks with tsc, incl. specs; keep the old checker
    experimental: { useTypeScriptCli: false },
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
    // Runtime configuration lives in environments/runtimeEnvironment.ts
    basePath: `${BASE_PATH}`,
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      IDENTITY_SERVER_SECRET: process.env.IDENTITY_SERVER_SECRET,
      IDENTITY_SERVER_ISSUER_DOMAIN: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
    },
  }),
)
