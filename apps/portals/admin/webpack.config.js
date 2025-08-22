// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('./../../../libs/shared/webpack/nrwl-config')
const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')

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
          context: ['/stjornbord/bff'],
          target: 'http://localhost:3010',
          secure: false,
          changeOrigin: true,
        },
      ],
    }
  }

  return {
    ...config,
    node: {
      global: true,
    },
  }
})
