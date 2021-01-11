const webpack = require('webpack')

module.exports = (config) => {
  const plugins = [
    ...config.plugins,
    new webpack.EnvironmentPlugin({
      CONTENT_SEARCH_INDEX_VERSION: 'thisVersion',
    }),
  ]

  return {
    ...config,
    plugins,
  }
}
