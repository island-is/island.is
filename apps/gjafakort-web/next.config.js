const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
module.exports = withCss(withSass({
  // Set this to true if you use CSS modules.
  // See: https://github.com/css-modules/css-modules
  cssModules: false,
}))
