const { composePlugins, withNx } = require('@nrwl/webpack')
const { withReact } = require('@nrwl/react')

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact(),
  (config, { options, context }) => {
    // Note: This was added by an Nx migration.
    // You should consider inlining the logic into this file.
    // For more information on webpack config and Nx see:
    // https://nx.dev/packages/webpack/documents/webpack-config-setup
    return require('./webpack.config.old.js')(config, context)
  },
)
