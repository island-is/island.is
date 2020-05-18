const withSass = require('@zeit/next-sass') // eslint-disable-line
const withCss = require('@zeit/next-css') // eslint-disable-line
const withTreat = require('next-treat')() // eslint-disable-line

const {
  API_URL = 'http://localhost:3333/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
} = process.env

module.exports = withSass(
  withCss(
    withTreat({
      cssModules: true,
      sassLoaderOptions: {
        includePaths: ['./apps/gjafakort/web/styles'],
      },
      serverRuntimeConfig: {
        // Will only be available on the server side
        apiUrl: API_URL,
      },
      publicRuntimeConfig: {
        // Will be available on both server and client
        apiUrl: `${WEB_PUBLIC_URL}/api`,
      },
    }),
  ),
)
