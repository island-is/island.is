const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')
const nrwlConfig = require('./../../../libs/shared/webpack/nrwl-config')

module.exports = composePlugins(
  withNx(),
  withReact(),
  nrwlConfig,
  (config, { options, context }) => {
    // App specific config
    config.stats.chunks = false
    config.stats.modules = false

    return {
      ...config,
      ...(process.env.PORT
        ? { devServer: { ...config.devServer, port: process.env.PORT } }
        : {}),
      node: {
        global: true,
      },
    }
  },
)
