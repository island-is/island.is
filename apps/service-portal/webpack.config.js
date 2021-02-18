/* eslint-disable */
const TreatPlugin = require('treat/webpack-plugin')
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')

module.exports = (config, context) => {
  nrwlConfig(config)

  config.stats.chunks = false
  config.stats.modules = false
  config.plugins.push(new TreatPlugin())

  return {
    ...config,
    node: {
      process: true,
      global: true,
    },
  }
}
