// eslint-disable-next-line @typescript-eslint/no-var-requires

// module.exports = (config) => {
//   // Add our common webpack config
//   nrwlConfig(config)
//
//   // App specific config
//   config.stats.chunks = false
//   config.stats.modules = false
//
//   return {
//     ...config,
//     node: {
//       global: true,
//     },
//   }
// }

const nrwlConfig = require('./../../libs/shared/webpack/nrwl-config')
const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx({
    nx: {
      svgr: true,
    },
  }),
  withReact({ svgr: true }),
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
