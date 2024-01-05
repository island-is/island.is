const { resolve } = require('path')
module.exports = {
  presets: [
    '@nx/next/babel',
    resolve(__dirname, '../../libs/shared/babel/web'),
  ],
  plugins: [],
}
