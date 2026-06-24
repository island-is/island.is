const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const {
  INTERNAL_API_URL = 'http://localhost:4444',
  BFF_PROXY_TARGET = 'http://localhost:3010',
} = process.env

const graphqlPath = '/api/graphql'

// In every deployed environment this app shares its ingress host with the
// `web` app, which owns `/` (and therefore `/_next`), and with
// `application-system-form`, which owns `/umsoknir`. Our pages are routed here
// only under `/umsoknir/sdf` (most-specific path-prefix match, no rewrite), so
// `basePath` makes Next serve both pages *and* assets under that prefix
// (`/umsoknir/sdf/<slug>` and `/umsoknir/sdf/_next/*`). The ingress then keeps
// every page/JS/CSS/font request on this service, with no collision against
// `web`'s `/_next` or the form's `/umsoknir`. Applied in all environments so
// local (`:4250`) and deployed URLs are identical.
//
// NB: a path-based `assetPrefix` was used here previously; it is wrong for this
// setup because Next strips it from *incoming* request URLs, turning
// `/umsoknir/sdf/<slug>` into `/<slug>` → no route → 404.
const BASE_PATH = '/umsoknir/sdf'

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
  basePath: BASE_PATH,
  async rewrites() {
    return {
      afterFiles: [
        {
          // `basePath: false` keeps this matching the un-prefixed `/bff/*` that
          // the client BFF generator still calls today. When the BFF is moved
          // under the app prefix (`/umsoknir/sdf/bff`), drop this flag.
          source: '/bff/:path*',
          destination: `${BFF_PROXY_TARGET}/bff/:path*`,
          basePath: false,
        },
      ],
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // The `/bff/:path*` rewrite above proxies through Next's router proxy, which
  // applies a default `proxyTimeout` of 30s and aborts the upstream socket once
  // it elapses ("Failed to proxy … socket hang up"). SDF submits run the full
  // onSubmit template-api actions + state transition synchronously on the API
  // before responding, which can exceed 30s. Raise the ceiling so the proxy
  // waits for the real backend response. (Note: `0` is falsy and falls back to
  // 30s in Next; use a positive value, or `null` to disable entirely.)
  experimental: {
    proxyTimeout: null,
  },
  nx: {
    svgr: false,
  },
}

const plugins = [withNx, withVanillaExtract]

module.exports = composePlugins(...plugins)(nextConfig)
