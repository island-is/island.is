const DefinePlugin = require('webpack/lib/DefinePlugin')
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin')
const nrwlConfig = require('@nrwl/react/plugins/webpack.js')
const webpack = require('webpack')

/**
 * This file is based on how @nrwl/web does it's env config
 * https://github.com/nrwl/nx/blob/master/packages/web/src/utils/config.ts
 */

/**
 * This functions finds the DefinePlugin from the webpack plugins list
 * And sets the API_MOCKS env variable to make sure it is always set.
 */
const setApiMocks = (config) => {
  config.plugins.forEach((plugin) => {
    // Find the DefinePlugin and check if it has 'process.env' key
    if (plugin instanceof DefinePlugin && plugin.definitions['process.env']) {
      // Switch from 'process.env' definition to 'process.env.*' definitions.
      // Otherwise webpack is unable to properly remove unused code from bundles.
      plugin.definitions = Object.entries(
        plugin.definitions['process.env'],
      ).reduce(
        (defs, [key, value]) => ({ ...defs, [`process.env.${key}`]: value }),
        {},
      )

      // Set API_MOCKS so it's always set before webpack does its things
      plugin.definitions['process.env.API_MOCKS'] = JSON.stringify(
        process.env.API_MOCKS || '',
      )
    }
  })
}

// UPGRADE WARNING
// This is to fix a bug in @nrwl/web 11.4.0 where some css rules would have misconfigured postcss.
// Can be removed after upgrading to 12.1.0 or beyond. This should not appear in build logs when this is removed:
// "You did not set any plugins, parser, or stringifier. Right now, PostCSS does nothing. Pick plugins for your case on https://www.postcss.parts/ and use them in postcss.config.js."
const fixPostcss = (config) => {
  config.module.rules.forEach((rule) => {
    // Find CSS-like rule.
    if (!Array.isArray(rule.oneOf)) {
      return
    }
    rule.oneOf.forEach((subRule) => {
      // Find css-like use array.
      if (!Array.isArray(subRule.use)) {
        return
      }
      subRule.use.forEach((use) => {
        // Find postcss loader.
        if (!use.loader?.includes('postcss-loader')) {
          return
        }
        // Fix accidental nested postcssOptions.
        if (use.options.postcssOptions?.postcssOptions) {
          use.options = use.options.postcssOptions
        }
      })
    })
  })
}

/**
 * This method adds the polyfills that webpack4 previously added
 * but was removed in webpack 5. NextJS does this for the Next apps
 * @param {*} config Webpack config object
 */
const addNodeModulesPolyfill = (config) => {
  config.resolve.fallback = {
    assert: require.resolve('assert'),
    buffer: require.resolve('buffer'),
    console: require.resolve('console-browserify'),
    constants: require.resolve('constants-browserify'),
    crypto: require.resolve('crypto-browserify'),
    domain: require.resolve('domain-browser'),
    events: require.resolve('events'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    path: require.resolve('path-browserify'),
    punycode: require.resolve('punycode'),
    process: require.resolve('process/browser'),
    querystring: require.resolve('querystring-es3'),
    stream: require.resolve('stream-browserify'),
    string_decoder: require.resolve('string_decoder'),
    sys: require.resolve('util'),
    timers: require.resolve('timers-browserify'),
    tty: require.resolve('tty-browserify'),
    url: require.resolve('url'),
    util: require.resolve('util'),
    vm: require.resolve('vm-browserify'),
    zlib: require.resolve('browserify-zlib'),
  }

  config.plugins.push(
    new webpack.ProvidePlugin({
      process: [require.resolve('process')],
    }),
  )
}

/**
 * Adds common web related configs to webpack
 * @param {*} config
 */
module.exports = function (config) {
  // Call @nrwl/react plugin for default webpack config
  nrwlConfig(config)

  setApiMocks(config)
  addNodeModulesPolyfill(config)

  fixPostcss(config)

  // Add the Vanilla Extract plugin
  config.plugins.push(new VanillaExtractPlugin())

  return config
}
