// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nx/next/plugins/with-nx')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/

const nextConfig = {
  nx: {
    svgr: false,
  },
}

module.exports = withNx(withVanillaExtract(nextConfig))

//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { composePlugins, withNx } = require('@nx/next')

// /**
//  * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
//  **/
// const nextConfig = {
//   nx: {
//     // Set this to true if you would like to use SVGR
//     // See: https://github.com/gregberge/svgr
//     svgr: false,
//   },
// }

// const plugins = [
//   // Add more Next.js plugins to this list if needed.
//   withNx,
// ]

// module.exports = composePlugins(...plugins)(nextConfig)
