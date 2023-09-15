const nrwlConfig = require('./../../libs/shared/webpack/nrwl-config')
const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')

const isDev = process.env.NODE_ENV === 'development'

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), nrwlConfig, (config) => {
  // App specific config
  config.stats.chunks = false
  config.stats.modules = false

  if (isDev) {
    config.devtool = 'eval-cheap-module-source-map'
  }

  return {
    ...config,
    node: {
      global: true,
    },
  }
})
