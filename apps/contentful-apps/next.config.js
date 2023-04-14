// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  env: {
    NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    NEXT_PUBLIC_CONTENTFUL_SPACE: process.env.CONTENTFUL_SPACE,
    NEXT_PUBLIC_MIDEIND_TRANSLATION_API_BASE_URL:
      process.env.MIDEIND_TRANSLATION_API_BASE_URL,
    NEXT_PUBLIC_MIDEIND_TRANSLATION_API_KEY:
      process.env.MIDEIND_TRANSLATION_API_KEY,
  },
}

module.exports = withNx(nextConfig)
