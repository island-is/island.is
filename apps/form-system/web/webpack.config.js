const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')
const nrwlConfig = require('./../../../libs/shared/webpack/nrwl-config')

const isDev = process.env.NODE_ENV === 'development'

module.exports = composePlugins(withNx(), withReact(), nrwlConfig, (config) => {
  // App specific config
  config.stats.chunks = false
  config.stats.modules = false

  if (isDev) {
    config.devtool = 'eval-cheap-module-source-map'

    // Add proxy configuration for development
    config.devServer = {
      ...config.devServer,
      proxy: [
        {
          context: ['/bff'],
          target: 'http://localhost:3010',
          secure: false,
          changeOrigin: true,
        },
      ],
    }
  }

  return {
    ...config,
    ...(process.env.PORT
      ? { devServer: { ...config.devServer, port: process.env.PORT } }
      : {}),
    node: {
      global: true,
    },
  }
})
