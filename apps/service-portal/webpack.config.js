// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('./../../libs/shared/webpack/nrwl-config')

module.exports = (config, context) => {
  // Add our common webpack config
  nrwlConfig(config)

  return {
    ...config,
    node: {
      process: true,
      global: true,
    },
  }
}
