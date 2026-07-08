const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()
const { createSecureHeaders } = require('next-secure-headers')

module.exports = withNx(
  withVanillaExtract({
    basePath: '/admin',
    cssModules: false,
    // serverRuntimeConfig/publicRuntimeConfig were removed in Next.js 16.
    // This app read neither block at runtime (the backend base URL is the
    // static '/backend' path in services/api.ts), so no runtime-env module
    // is needed here — unlike the other migrated apps.
    webpack: (config, { isServer, dev }) => {
      if (!dev && isServer) {
        config.devtool = 'source-map'
      }
      return config
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
