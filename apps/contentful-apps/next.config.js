// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')

const {
  MIDEIND_TRANSLATION_API_KEY,
  CONTENTFUL_ENVIRONMENT,
  CONTENTFUL_SPACE,
  MIDEIND_TRANSLATION_API_BASE_URL,
} = process.env

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  publicRuntimeConfig: {
    MIDEIND_TRANSLATION_API_KEY,
    CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_SPACE,
    MIDEIND_TRANSLATION_API_BASE_URL,
  },
}

module.exports = withNx(nextConfig)
