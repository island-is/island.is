const { composePlugins, withNx } = require('@nx/next')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const tinymceDir = path.dirname(require.resolve('tinymce/package.json'))

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

    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            'tinymce.min.js',
            'plugins',
            'skins',
            'themes',
            'icons',
          ].map((asset) => ({
            from: path.join(tinymceDir, asset),
            to: path.join(__dirname, 'public/tinymce', asset),
          })),
        }),
      )
    }

    // Important: return the modified config
    return config
  },
  // Runtime configuration lives in environments/runtimeEnvironment.ts
  // (serverRuntimeConfig/publicRuntimeConfig were removed in Next.js 16)
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
