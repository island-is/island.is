const DefinePlugin = require('webpack/lib/DefinePlugin')
const TreatPlugin = require('treat/webpack-plugin')
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')

/**
 * This file is based on how @nrwl/web does it's env config
 * https://github.com/nrwl/nx/blob/master/packages/web/src/utils/config.ts#L84
 * https://github.com/nrwl/nx/blob/master/packages/web/src/utils/config.ts#L201
 */

/**
 * This functions finds the DefinePlugin from the webpack plugins list
 * And sets the API_MOCKS env variable to make sure it is always set.
 */
const setApiMocks = (config) => {
  config.plugins.forEach((plugin) => {
    // Find the DefinePlugin
    if (plugin instanceof DefinePlugin) {
      // Set API_MOCKS so it's always set before webpack does its things
      plugin.definitions['process.env'].API_MOCKS = JSON.stringify(
        process.env.API_MOCKS,
      )
    }
  })
}

/**
 * Adds common web related configs to webpack
 * @param {*} config
 */
module.exports = function (config) {
  // Call @nrwl/react plugin for default webpack config
  nrwlConfig(config)

  setApiMocks(config)

  // Add the Treat plugin
  config.plugins.push(new TreatPlugin())
}
