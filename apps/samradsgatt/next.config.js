// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withNx(
  withVanillaExtract({
    basePath: '/samradsgatt',
    presets: ['next/babel'],
  }),
)
