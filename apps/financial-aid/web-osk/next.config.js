const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
})

module.exports = withNx(
  withVanillaExtract({
    experimental: {
      // Source maps for the server production bundle, previously configured
      // through the custom webpack config (config.devtool).
      serverSourceMaps: true,
    },
    // Runtime configuration lives in environments/runtimeEnvironment.ts
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
  }),
)
