const path = require('path')
const { IgnorePlugin } = require('webpack')
const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default
const { DuplicatesPlugin } = require('inspectpack/plugin')

/** Page ids the old court websites (all on the same CMS) used for verdicts */
const LEGACY_COURT_VERDICT_PAGE_IDS =
  '(?:347c3bb1-8926-11e5-80c6-005056bc6a40|d2ca19a6-a3fa-11e5-9402-005056bc0bdb)'

/**
 * Old court websites redirect to island.is/redirects/<host>/<path>.
 * Their verdict urls are handled by /api/redirects/court-verdict,
 * other urls fall through to the CMS 404 redirects.
 */
const legacyCourtVerdictRewrites = [
  {
    domain: 'landsrettur',
    site: 'landsrettur',
    kind: 'verdict',
    paths: ['/domar-og-urskurdir/domur-urskurdur', '/domar-og-urskurdir/domur'],
    verdictPageAlias: true,
  },
  {
    domain: 'landsrettur',
    site: 'landsrettur',
    kind: 'document',
    paths: ['/domar-og-urskurdir/domur-urskurdur/$Verdict/Download'],
  },
  {
    domain: 'haestirettur',
    site: 'haestirettur',
    kind: 'verdict',
    paths: ['/domar/domur', '/domar/_domur'],
    verdictPageAlias: true,
  },
  {
    domain: 'haestirettur',
    site: 'haestirettur',
    kind: 'determination',
    paths: ['/akvardanir/_malskotsbeidni', '/malskotsbeidnir/_malskotsbeidni'],
  },
  {
    domain: 'haestirettur',
    site: 'haestirettur',
    kind: 'nr',
    paths: ['/domar'],
  },
  {
    domain: 'haestirettur',
    site: 'haestirettur',
    kind: 'ifx',
    paths: ['/ifx_hr'],
  },
  {
    domain: 'heradsdomstolar',
    site: 'district',
    kind: 'verdict',
    paths: ['/domar/domur', '/heradsdomstolar/:court/domar/domur'],
    verdictPageAlias: true,
  },
  {
    domain: 'domstolar',
    site: 'district',
    kind: 'verdict',
    paths: ['/domar/domur', '/heradsdomstolar/:court/domar/domur'],
    verdictPageAlias: true,
  },
  {
    domain: 'domstolar',
    site: 'district',
    kind: 'search',
    paths: ['/domaleit/nanar'],
  },
  {
    domain: 'endurupptokudomur',
    site: 'endurupptokudomur',
    kind: 'verdict',
    paths: ['/urskurdir/domur-urskurdur'],
    verdictPageAlias: true,
  },
].flatMap(({ domain, site, kind, paths, verdictPageAlias }) => {
  const prefix = `/redirects/:legacyHost((?:www\\.)?${domain}\\.is)`
  const destination = `/api/redirects/court-verdict?site=${site}&kind=${kind}`
  const rewrites = paths.map((path) => ({
    source: `${prefix}${path}`,
    destination,
  }))
  if (verdictPageAlias) {
    for (const path of ['', '/default.aspx']) {
      rewrites.push({
        source: `${prefix}${path}`,
        has: [
          {
            type: 'query',
            key: 'pageid',
            value: LEGACY_COURT_VERDICT_PAGE_IDS,
          },
        ],
        destination,
      })
    }
  }
  return rewrites
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
      ...legacyCourtVerdictRewrites,
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
  webpack: (config, { isServer, dev }) => {
    if (process.env.ANALYZE === 'true' && !isServer) {
      config.plugins.push(
        new DuplicatesPlugin({
          emitErrors: false,
          verbose: true,
        }),
      )

      config.plugins.push(
        new StatoscopeWebpackPlugin({
          saveTo: 'dist/apps/web/statoscope.html',
          saveStatsTo: 'dist/apps/web/stats.json',
          statsOptions: { all: true, source: false },
        }),
      )

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        }),
      )
    }

    if (!isServer) {
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /^@island.is\/clients\/middlewares$/,
        }),
      )
    }

    if (!dev && isServer) {
      config.devtool = 'source-map'
    }

    const modules = path.resolve(__dirname, '../..', 'node_modules')

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@babel/runtime': path.resolve(modules, '@babel/runtime'),
      'bn.js': path.resolve(modules, 'bn.js'),
      'date-fns': path.resolve(modules, 'date-fns'),
      'es-abstract': path.resolve(modules, 'es-abstract'),
      'escape-string-regexp': path.resolve(modules, 'escape-string-regexp'),
      'readable-stream': path.resolve(modules, 'readable-stream'),
      'react-popper': path.resolve(modules, 'react-popper'),
      inherits: path.resolve(modules, 'inherits'),
      'graphql-tag': path.resolve(modules, 'graphql-tag'),
      'safe-buffer': path.resolve(modules, 'safe-buffer'),
      scheduler: path.resolve(modules, 'scheduler'),
    }

    return config
  },

  // The prod container's .next/cache is read-only, so Next 16's on-disk image
  // LRU throws EACCES on mkdir. Disable it; CloudFront caches optimized images.
  images: {
    maximumDiskCacheSize: 0,
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
