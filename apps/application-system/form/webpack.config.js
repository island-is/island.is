// eslint-disable-next-line @typescript-eslint/no-var-requires
const TreatPlugin = require('treat/webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')

module.exports = (config) => {
  nrwlConfig(config) // first call it so that it @nrwl/react plugin adds its configs,
  config.stats.chunks = false
  config.stats.modules = false
  config.devServer.stats.chunks = false
  config.devServer.stats.modules = false
  config.devServer.noInfo = true
  return {
    ...config,
    plugins: [...config.plugins, new TreatPlugin()],
  }
}
