// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('@nx/react/plugins/webpack.js')

module.exports = (config) => {
  nrwlConfig(config) // first call it so that it @nx/react plugin adds its configs,

  config.stats.chunks = false
  config.stats.modules = false

  return config
}
