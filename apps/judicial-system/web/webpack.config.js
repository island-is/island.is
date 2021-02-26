// eslint-disable-next-line @typescript-eslint/no-var-requires
const nrwlConfig = require('./../../../libs/shared/webpack/nrwl-config')

module.exports = (config) => {
  // Add our common webpack config
  nrwlConfig(config)

  return config
}
