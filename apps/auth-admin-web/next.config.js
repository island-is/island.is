const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')
const { createSecureHeaders } = require('next-secure-headers')

/* eslint-disable @typescript-eslint/no-var-requires */

// These modules need to be transpiled for IE11 support. This is not ideal,
// we should aim to drop IE11 support, or only use dependencies that have
// ES5 code (optionally plus ES6 module syntax).
const transpileModules = [
  'templite', // used by rosetta.
  '@sindresorhus/slugify',
  '@sindresorhus/transliterate', // Used by slugify.
  'escape-string-regexp', // Used by slugify.
]
const withTM = require('next-transpile-modules')(transpileModules)
const withVanillaExtract = createVanillaExtractPlugin()
const { NEXT_PUBLIC_BACKEND_URL } = 'http://localhost:4200/backend'

module.exports = withVanillaExtract(
  withTM(
    withHealthcheckConfig({
      basePath: '/admin',
      cssModules: false,
      serverRuntimeConfig: {
        // Will only be available on the server side
        // Requests made by the server are internal request made directly to the api hostname
        backendUrl: NEXT_PUBLIC_BACKEND_URL,
      },
      publicRuntimeConfig: {
        backendUrl: '',
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
                  scriptSrc: ["'self'"],
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
  ),
)
