const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
})
/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/umsoknir/:slug',
        destination: 'https://island.is/umsoknir/:slug',
      },
      {
        source: '/rss.xml',
        destination: '/api/rss',
      },
      {
        source: '/opinbernyskopun/rss.xml',
        destination: '/api/rss/opinbernyskopun',
      },
      {
        source: '/rss/domar',
        destination: '/api/domar/rss',
      },
      {
        source: '/rss/domar.xml',
        destination: '/api/domar/rss',
      },
      {
        source: '/rss/dagskra-domstola',
        destination: '/api/dagskra-domstola/rss',
      },
      {
        source: '/rss/dagskra-domstola.xml',
        destination: '/api/dagskra-domstola/rss',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/en/organizations',
        destination: '/en/o',
        permanent: true,
      },
      {
        source: '/en/organizations/:slug',
        destination: '/en/o/:slug',
        permanent: true,
      },
      {
        source: '/en/organizations/:slug/:subSlug',
        destination: '/en/o/:slug/:subSlug',
        permanent: true,
      },
      {
        source: '/stofnanir',
        destination: '/s',
        permanent: true,
      },
      {
        source: '/s/haskolanam',
        destination: '/haskolanam',
        permanent: true,
      },
      {
        source: '/s/opingogn',
        destination: '/opingogn',
        permanent: true,
      },
      {
        source: '/en/o/university-studies',
        destination: '/university-studies',
        permanent: true,
      },
      {
        source: '/stofnanir/:slug',
        destination: '/s/:slug',
        permanent: true,
      },
      {
        source: '/stofnanir/:slug/:subSlug',
        destination: '/s/:slug/:subSlug',
        permanent: true,
      },
      {
        source: '/handbaekur',
        destination: '/leit?q=*&type=webManual',
        permanent: true,
      },
      {
        source: '/en/manuals',
        destination: '/en/search?q=*&type=webManual',
        permanent: true,
      },
      {
        source: '/en/o/icelandic-health-insurance',
        destination: '/en/o/iceland-health',
        permanent: true,
      },
      {
        source: '/en/help/icelandic-health-insurance',
        destination: '/en/help/iceland-health',
        permanent: true,
      },
      {
        source: '/en/o/icelandic-health-insurance/:subSlug*',
        destination: '/en/o/iceland-health/:subSlug*',
        permanent: true,
      },
      {
        source: '/en/help/icelandic-health-insurance/:subSlug*',
        destination: '/en/help/iceland-health/:subSlug*',
        permanent: true,
      },
      {
        source: '/adstod/tryggingastofnun/hafa-samband',
        destination: 'https://minarsidur.tr.is/hafa-samband',
        permanent: true,
      },
      {
        source: '/en/help/social-insurance-administration/contact-us',
        destination: 'https://minarsidur.tr.is/hafa-samband',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source:
          '/.well-known/apple-developer-merchantid-domain-association.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
    ]
  },
  experimental: {
    // Source maps for the server production bundle, previously configured
    // through the custom webpack config (config.devtool).
    serverSourceMaps: true,
    // Prefer `nx analyze web` for bundle inspection. ANALYZE=true is only for
    // reading raw chunk text, which numeric module ids and scope hoisting
    // otherwise make unattributable. It changes chunk sizes, so don't compare
    // absolute bytes against a normal build.
    ...(process.env.ANALYZE === 'true'
      ? { turbopackModuleIds: 'named', turbopackScopeHoisting: false }
      : {}),
  },
  turbopack: {
    resolveAlias: {
      // Server-only (behind RUNTIME_ENV checks); previously excluded from
      // browser bundles with webpack IgnorePlugin.
      '@island.is/clients/middlewares': {
        browser: './turbopack/emptyModule.ts',
      },
    },
  },

  // Runtime configuration lives in environments/runtimeEnvironment.ts
  env: {
    API_MOCKS: process.env.API_MOCKS || '',
  },
}

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withVanillaExtract,
]

module.exports = composePlugins(...plugins)(nextConfig)
