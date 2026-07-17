//@ts-check

const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const withVanillaExtract = createVanillaExtractPlugin()

const { BASEPATH = '/greida' } = process.env

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  webpack: (config, { dev }) => {
    // Workaround for Firefox "unterminated comment" when loading vanilla-extract
    // global.css (gzip+base64 in magic comments). Shorten those comments in dev
    // so Firefox's parser doesn't choke (Firefox-only, dev-only bug).
    if (dev) {
      config.optimization = config.optimization || {}
      config.optimization.moduleIds = 'deterministic'
      config.output = config.output || {}
      config.output.pathinfo = false
      config.plugins = config.plugins || []
    }
    return config
  },
  // Runtime configuration lives in environments/runtimeEnvironment.ts
  // (serverRuntimeConfig/publicRuntimeConfig were removed in Next.js 16)
  basePath: `${BASEPATH}`,
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
