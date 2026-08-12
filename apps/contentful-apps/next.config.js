// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
})

const graphqlPath = '/api/graphql'
const { PUBLIC_API_URL = 'https://island.is' } = process.env

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async rewrites() {
    return [
      {
        source: graphqlPath,
        destination: `${PUBLIC_API_URL}${graphqlPath}`,
      },
    ]
  },
  nx: {},
  experimental: {
    // Source maps for the server production bundle, previously configured
    // through the custom webpack config (config.devtool).
    serverSourceMaps: true,
  },
  // Runtime configuration lives in environments/runtimeEnvironment.ts
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
