// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')
const nrwlConfig = require('./../../../libs/shared/webpack/nrwl-config')

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
//     ...(process.env.PORT
//       ? { devServer: { ...config.devServer, port: process.env.PORT } }
//       : {}),
//     node: {
//       global: true,
//     },
//   }
// }

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
      ...(process.env.PORT
        ? { devServer: { ...config.devServer, port: process.env.PORT } }
        : {}),
      node: {
        global: true,
      },
    }
  },
)
