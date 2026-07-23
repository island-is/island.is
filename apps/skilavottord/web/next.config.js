const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const { withNx, composePlugins } = require('@nx/next')
const withVanillaExtract = createVanillaExtractPlugin()

const { BASE_PATH = '/app/skilavottord' } = process.env

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
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
  basePath: `${BASE_PATH}`,
  async redirects() {
    return [
      {
        source: `${BASE_PATH}`,
        destination: '/',
        basePath: false,
        permanent: false,
      },
    ]
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
