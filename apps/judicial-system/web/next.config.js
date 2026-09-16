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
  // The prod container's .next/cache is owned by root and the app runs as a
  // non-root user, so Next 16's on-disk image LRU throws EACCES on mkdir.
  // This app doesn't use next/image, so the disk cache is not needed.
  images: {
    maximumDiskCacheSize: 0,
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
