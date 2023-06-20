const nrwlConfig = require('./../../libs/shared/webpack/nrwl-config')
const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')

// Nx plugins for webpack.
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
      node: {
        global: true,
      },
    }
  },
)
