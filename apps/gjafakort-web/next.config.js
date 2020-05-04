const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')

const {
  API_URL = 'http://localhost:4444/api',
  WEB_PUBLIC_URL = 'http://localhost:4200',
} = process.env

module.exports = withCss(withSass({
  // Set this to true if you use CSS modules.
  // See: https://github.com/css-modules/css-modules
  cssModules: false,
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: API_URL,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: `${WEB_PUBLIC_URL}/api`,
  },
}))
