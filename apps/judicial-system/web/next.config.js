const { composePlugins, withNx } = require('@nx/next')

const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    if (!dev && isServer) {
      config.devtool = 'source-map'
    }

    // Important: return the modified config
    return config
  },
  // Runtime configuration lives in environments/runtimeEnvironment.ts
  env: {
    API_MOCKS: process.env.API_MOCKS ?? '',
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
