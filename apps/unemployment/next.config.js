const withTreat = require('next-treat')()
const withSourceMaps = require('@zeit/next-source-maps')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx')

module.exports = withSourceMaps(withTreat({}))
