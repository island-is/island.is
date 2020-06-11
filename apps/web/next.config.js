const withTreat = require('next-treat')()

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

const { API_URL = 'http://localhost:4444/graphql' } = process.env

module.exports = withTreat(
  withTM({
    cssModules: false,
    serverRuntimeConfig: {
      // Will only be available on the server side
      apiUrl: API_URL,
    },
    publicRuntimeConfig: {
      // Will be available on both server and client
      apiUrl: API_URL,
      features: {
        loanApplication: process.env.LOAN_APPLICATION_ENABLED === 'true',
      },
    },
  }),
)
