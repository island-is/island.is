// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')

const { BASE_PATH = '/samradsgatt' } = process.env
const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
})

// Unset keys must be omitted (not passed as undefined): Turbopack requires
// serializable env, and inlining '' would stop the server falling back to
// real process.env at runtime. Only set in local dev.
const env = Object.fromEntries(
  Object.entries({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    IDENTITY_SERVER_SECRET: process.env.IDENTITY_SERVER_SECRET,
    IDENTITY_SERVER_ISSUER_DOMAIN: process.env.IDENTITY_SERVER_ISSUER_DOMAIN,
  }).filter(([, value]) => value !== undefined),
)

module.exports = withNx(
  withVanillaExtract({
    experimental: {
      // Source maps for the server production bundle, previously configured
      // through the custom webpack config (config.devtool).
      serverSourceMaps: true,
    },
    // Runtime configuration lives in environments/runtimeEnvironment.ts
    basePath: `${BASE_PATH}`,
    env,
  }),
)
