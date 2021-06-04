// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('./../../libs/shared/webpack/nrwl-config')

module.exports = (config) => {
  // Add our common webpack config
  nrwlConfig(config)

  // App specific config
  config.stats.chunks = false
  config.stats.modules = false

  if (process.env.NODE_ENV === 'development') {
    config.devServer.noInfo = true
  }

  return {
    ...config,
    node: {
      process: true,
      global: true,
    },
  }
}
