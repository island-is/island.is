// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('./../../../libs/shared/webpack/nrwl-config')

module.exports = (config) => {
  // Add our common webpack config
  nrwlConfig(config)

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
}
