const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
})
const { createSecureHeaders } = require('next-secure-headers')

module.exports = withNx(
  withVanillaExtract({
    basePath: '/admin',
    cssModules: false,
    experimental: {
      // Source maps for the server production bundle, previously configured
      // through the custom webpack config (config.devtool).
      serverSourceMaps: true,
    },
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: createSecureHeaders({
            contentSecurityPolicy: {
              directives: {
                defaultSrc: "'self'",
                objectSrc: "'none'",
                frameSrc: "'none'",
                baseURI: "'self'",
                styleSrc: ["'self' 'unsafe-inline'"],
                scriptSrc:
                  process.env.NODE_ENV === 'production'
                    ? ["'self'"]
                    : ["'self' 'unsafe-eval'"],
                connectSrc: ["'self'"],
              },
            },
            forceHTTPSRedirect: [
              true,
              { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true },
            ],
            nosniff: 'nosniff',
            frameGuard: 'deny',
            referrerPolicy: 'no-referrer',
          }),
        },
      ]
    },
    poweredByHeader: false,
  }),
)
