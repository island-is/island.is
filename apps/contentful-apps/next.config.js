// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

module.exports = withNx(
  withVanillaExtract({
    webpack: (config, options) => {
      return config
    },
    publicRuntimeConfig: {
      contentfulEnvironment: 'master',
      contentfulSpace: '8k0h54kbe6bj',
      mideindTranslationApiBaseUrl:
        'https://stafraentisland.greynir.is/translate',
      mideindTranslationApiKey: 'foo',
    },
  }),
)
