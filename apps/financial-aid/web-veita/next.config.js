const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withNx(
  withVanillaExtract({
    webpack: (config, { isServer, dev }) => {
      if (!dev && isServer) {
        config.devtool = 'source-map'
      }
      return config
    },
    // Runtime configuration lives in environments/runtimeEnvironment.ts
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
  }),
)
