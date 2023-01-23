// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()
const { NODE_ENV } = process.env
const basePathEnv = NODE_ENV === 'production' ? '/samradsgatt' : ''
module.exports = withNx(
  withVanillaExtract({
    basePath: basePathEnv,
    presets: ['next/babel'],
  }),
)
