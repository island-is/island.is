// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()
const path = process.env.NODE_ENV === 'production' ? '/samradsgatt' : ''
module.exports = withNx(
  withVanillaExtract({
    basePath: path,
    presets: ['next/babel'],
  }),
)
