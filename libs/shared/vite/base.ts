import { cpSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

/**
 * Shared pieces for the SPA vite configs (imported by each app's
 * vite.config.ts with a relative path, same pattern as
 * libs/shared/webpack/nrwl-config.js for the webpack apps).
 */

/**
 * Match webpack's module resolution: some dependencies (e.g. react-csv)
 * publish a `jsnext:main` pointing at untranspiled JSX sources, which vite's
 * default mainFields would pick up.
 */
export const mainFields = ['browser', 'module', 'main']

/**
 * `import './foo.css'` is the vanilla-extract convention for `foo.css.ts`.
 * Vite 8 treats a `.css` specifier as a stylesheet and will not try `.css.ts`
 * unless we remap it. Real `.css` files still resolve when no `.css.ts` exists.
 *
 * Only relative specifiers are remapped: package CSS (e.g. react-pdf's
 * `dist/Page/TextLayer.css`) is not exported as `.css.ts`, and Vite throws
 * on unmatched package exports instead of returning null.
 *
 * Registered through `nodeBuiltinPolyfills()` so each SPA vite.config does
 * not have to list this plugin itself.
 */
const resolveVanillaExtractCss = (): Plugin => ({
  name: 'resolve-vanilla-extract-css',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (
      !importer ||
      !source.startsWith('.') ||
      !source.endsWith('.css') ||
      source.endsWith('.vanilla.css') ||
      source.includes('\0')
    ) {
      return null
    }
    try {
      return await this.resolve(`${source}.ts`, importer, {
        ...options,
        skipSelf: true,
      })
    } catch {
      return null
    }
  },
})

/**
 * The compile-time constants the webpack builds define (see
 * libs/shared/webpack/nrwl-config.js). Runtime configuration goes through the
 * __SI_ENVIRONMENT__ script tag instead, not compile-time env.
 */
export const define = {
  global: 'globalThis',
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'development'),
  'process.env.API_MOCKS': JSON.stringify(process.env.API_MOCKS ?? ''),
  // @apollo/client 3.7 reads a bundler-defined __DEV__ global.
  __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
}

/**
 * Aliases that keep Next.js-only modules (reached through library barrels)
 * and the API mocks (with their faker dependency) out of SPA bundles.
 */
export const spaAliases = (workspaceRoot: string) => {
  const stubs = `${workspaceRoot}/libs/shared/vite/stubs`
  return {
    'next/router': `${stubs}/nextRouter.ts`,
    'next/link': `${stubs}/nextLink.tsx`,
    ...(process.env.API_MOCKS === 'true'
      ? {}
      : { '@island.is/api/mocks': `${stubs}/apiMocksDisabled.ts` }),
  }
}

/**
 * Dev-mode replacement for scripts/dockerfile-assets/bash/extract-environment:
 * expands the environment placeholder with the SI_PUBLIC_* variables from the
 * local shell, the same way the docker entrypoint does at container startup.
 * Production builds keep the placeholder for the entrypoint to expand.
 */
export const injectDevSiEnvironment = (): Plugin => ({
  name: 'inject-dev-si-environment',
  apply: 'serve',
  transformIndexHtml(html) {
    const environment = Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) =>
          key.startsWith('SI_PUBLIC_') ||
          key === 'APP_VERSION' ||
          key === 'PROD_MODE',
      ),
    )
    return html.replace(
      '<!-- environment placeholder -->',
      `<script id="__SI_ENVIRONMENT__" type="application/json">${JSON.stringify(
        environment,
      ).replace(/</g, '\\u003c')}</script>`,
    )
  },
})

/**
 * The node builtins the webpack builds polyfill (see resolve.fallback and the
 * Buffer ProvidePlugin in libs/shared/webpack/nrwl-config.js) — browser code
 * really uses them, e.g. csv-stringify for table exports and simpleEncryption.
 *
 * Also registers the vanilla-extract `.css` → `.css.ts` remap. Vite flattens
 * nested plugin arrays, so SPA configs keep calling this once.
 */
export const nodeBuiltinPolyfills = (): Plugin[] => [
  resolveVanillaExtractCss(),
  nodePolyfills({
    include: ['crypto', 'stream', 'buffer', 'events', 'string_decoder', 'vm'],
    // The polyfilled crypto/stream modules reference the process global at
    // runtime (process.nextTick, process.browser) — without the shim the
    // chunks that bundle them throw "process is not defined" on load.
    globals: { Buffer: true, global: false, process: true },
  }),
]

const assetMimeTypes: Record<string, string> = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  json: 'application/json',
  ico: 'image/x-icon',
}

/**
 * Mirrors the webpack `assets` option for a directory that is both imported
 * from code (bundled by vite as usual) and referenced by URL strings like
 * `./assets/images/x.svg` (resolved against the app's base href): copies the
 * directory into the build output and serves it in dev.
 */
export const staticAssetsDir = (dir: string, urlPath: string): Plugin => {
  let outDir: string
  return {
    name: 'static-assets-dir',
    configResolved(config) {
      outDir = config.build.outDir
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0]
        if (!url.startsWith(urlPath)) return next()
        const file = join(dir, decodeURIComponent(url.slice(urlPath.length)))
        if (!file.startsWith(dir) || !existsSync(file)) return next()
        const extension = file.split('.').pop() ?? ''
        res.setHeader(
          'Content-Type',
          assetMimeTypes[extension] ?? 'application/octet-stream',
        )
        res.end(readFileSync(file))
      })
    },
    closeBundle() {
      cpSync(dir, join(outDir, 'assets'), { recursive: true })
    },
  }
}

/**
 * The docker-static entrypoint (scripts/dockerfile-assets/bash/
 * extract-environment.js) expands the environment placeholder from
 * index.src.html into index.html at container start. The webpack builds
 * emitted the processed html under that name; emit a copy so the runtime
 * environment injection keeps working for vite builds.
 */
export const emitIndexSrcHtml = (): Plugin => {
  let outDir: string
  return {
    name: 'emit-index-src-html',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const index = join(outDir, 'index.html')
      if (existsSync(index)) {
        cpSync(index, join(outDir, 'index.src.html'))
      }
    },
  }
}

/**
 * Vite's dev server only responds under the exact base path and shows a hint
 * page for anything else. Redirect the bare base (and the site root) to it,
 * like the webpack dev server did.
 */
export const redirectToBase = (base: string): Plugin => ({
  name: 'redirect-to-base',
  apply: 'serve',
  configureServer(server) {
    const bare = base.replace(/\/$/, '')
    server.middlewares.use((req, res, next) => {
      const [path, query] = (req.url ?? '').split('?')
      if (path === bare || path === '/') {
        res.statusCode = 302
        res.setHeader('Location', base + (query ? `?${query}` : ''))
        res.end()
        return
      }
      next()
    })
  },
})

/** The local BFF proxy used by the portal dev servers. */
export const bffDevProxy = {
  '/bff': {
    target: 'http://localhost:3010',
    secure: false,
    changeOrigin: true,
  },
}
