const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const {
  INTERNAL_API_URL = 'http://localhost:4444',
  BFF_PROXY_TARGET = 'http://localhost:3010',
} = process.env

const graphqlPath = '/api/graphql'

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    if (!dev && isServer) {
      config.devtool = 'source-map'
    }

    // Guard against vanilla-extract CSS injection crash in App Router.
    // The extracted virtual CSS uses style-loader with an `insert` function
    // that calls `node.parentNode.insertBefore(...)`. During SSR-streamed
    // hydration, `parentNode` can be null. Replace with a safe fallback.
    if (!isServer) {
      const rules = config.module?.rules
      if (rules) {
        for (const rule of rules) {
          if (rule?.oneOf) {
            for (const oneOfRule of rule.oneOf) {
              const use = oneOfRule?.use
              if (Array.isArray(use)) {
                for (const loader of use) {
                  if (
                    typeof loader === 'object' &&
                    loader !== null &&
                    typeof loader.loader === 'string' &&
                    loader.loader.includes('style-loader') &&
                    loader.options?.insert
                  ) {
                    loader.options.insert = function (styleTag) {
                      var target =
                        document.head || document.querySelector('head')
                      if (target) {
                        target.appendChild(styleTag)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return config
  },
  serverRuntimeConfig: {
    graphqlEndpoint: `${INTERNAL_API_URL}${graphqlPath}`,
  },
  publicRuntimeConfig: {
    graphqlEndpoint: graphqlPath,
  },
  async rewrites() {
    return [
      {
        source: '/bff/:path*',
        destination: `${BFF_PROXY_TARGET}/bff/:path*`,
      },
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '',
  nx: {
    svgr: false,
  },
}

const plugins = [withNx, withVanillaExtract]

module.exports = composePlugins(...plugins)(nextConfig)
