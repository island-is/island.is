// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')

module.exports = (config) => {
  nrwlConfig(config) // first call it so that it @nrwl/react plugin adds its configs,
  config.stats.chunks = false
  config.stats.modules = false
  if (process.env.NODE_ENV === 'development') {
    config.devServer.noInfo = true
  }
  return config
}
