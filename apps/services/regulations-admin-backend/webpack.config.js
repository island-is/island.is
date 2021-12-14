// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')
// const webpack = require('webpack')

module.exports = (config) => {
  nrwlConfig(config) // first call it so that it @nrwl/react plugin adds its configs,

  config.stats.chunks = false
  config.stats.modules = false

  // config.plugins = [
  //   ...(config.plugins || []),
  //   new webpack.IgnorePlugin(/canvas/, /jsdom$/),
  // ]

  config.externals.canvas = '{}'
  // config.resolve.alias.canvas = false

  return config
}
