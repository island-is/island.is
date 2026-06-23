const { composePlugins, withNx } = require('@nx/next')
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin')
const withVanillaExtract = createVanillaExtractPlugin()

const {
  INTERNAL_API_URL = 'http://localhost:4444',
  BFF_PROXY_TARGET = 'http://localhost:3010',
} = process.env

const graphqlPath = '/api/graphql'

// In every deployed environment this app shares its ingress host with the
// `web` app, which owns `/` (and therefore `/_next`). Our pages are only
// routed here under `/umsoknir/sdf`, so Next's default root-level
// `/_next/static/*` asset URLs would be sent to `web` and 404. Prefixing the
// assets with an app-owned path that the ingress routes here keeps JS/CSS/font
// requests on this service. `assetPrefix` (rather than `basePath`) is used so
// pages can still be served under multiple prefixes (`/umsoknir/sdf/<slug>`
// and the allowlisted `/umsoknir/<slug>`). Only applied for production builds;
// local `nx serve` keeps assets at `/_next/*`.
const isProd = process.env.NODE_ENV === 'production'
const ASSET_PREFIX = '/umsoknir/sdf'

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
  ...(isProd ? { assetPrefix: ASSET_PREFIX } : {}),
  async rewrites() {
    return {
      // Assets are emitted at `/_next/*` but referenced via `assetPrefix`
      // (`/umsoknir/sdf/_next/*`) so the ingress routes them to this app. Map
      // the prefixed request back to the real path Next serves from.
      beforeFiles: isProd
        ? [
            {
              source: `${ASSET_PREFIX}/_next/:path*`,
              destination: '/_next/:path*',
            },
          ]
        : [],
      afterFiles: [
        {
          source: '/bff/:path*',
          destination: `${BFF_PROXY_TARGET}/bff/:path*`,
        },
      ],
    }
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // The `/bff/:path*` rewrite below proxies through Next's router proxy, which
  // applies a default `proxyTimeout` of 30s and aborts the upstream socket once
  // it elapses ("Failed to proxy … socket hang up"). SDF submits run the full
  // onSubmit template-api actions + state transition synchronously on the API
  // before responding, which can exceed 30s. Raise the ceiling so the proxy
  // waits for the real backend response. (Note: `0` is falsy and falls back to
  // 30s in Next; use a positive value, or `null` to disable entirely.)
  experimental: {
    proxyTimeout: null,
  },
  basePath: '',
  nx: {
    svgr: false,
  },
}

const plugins = [withNx, withVanillaExtract]

module.exports = composePlugins(...plugins)(nextConfig)
