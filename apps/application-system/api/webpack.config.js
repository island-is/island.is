const { composePlugins, withNx } = require('@nx/webpack')
const { withReact } = require('@nx/react')

module.exports = composePlugins(withReact({ ssr: true }), (config) => {
  // App specific config
  config.stats.chunks = false
  config.stats.modules = false

  return config
})
