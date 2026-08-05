import '@island.is/infra-tracing'

import { randomBytes } from 'crypto'
import createExpressApp, { Express } from 'express'

import next from 'next'

import { startMetricServer } from '@island.is/infra-metrics'
import { logger, monkeyPatchServerLogging } from '@island.is/logging'

import { getNextConfig } from './config'
import { ExternalEndpointDependencies, setupHealthchecks } from './health'
import { setupProxy } from './proxy'

type BootstrapOptions = {
  /**
   * Server name.
   */
  name: string

  /**
   * Path to next app.
   */
  appDir: string

  /**
   * Server port.
   */
  port?: number

  /**
   * Proxy configuration. Ignored in production (according to NODE_ENV).
   */
  proxyConfig?: { [context: string]: any }

  /**
   * External dependencies to do DNS lookup for the /readiness healthcheck
   * If values needs to be read from the next config of the app you can provide
   * a callback function, which is called when the next config has loaded.
   */
  externalEndpointDependencies?: ExternalEndpointDependencies

  /**
   * Opt-in per-request Content-Security-Policy. Given a fresh nonce (and, when
   * provided, the CSP `template` from the `x-csp-template` request header), returns
   * the final CSP string. When set, a nonce is minted per document request and the
   * result is placed on the request's `content-security-policy` header (which Next
   * reads to nonce its own inline scripts) and on the response header. Done here
   * rather than in Next middleware because middleware request-header overrides do
   * not reach the pages renderer through this custom server.
   *
   * The `template` seam keeps the allow-list a single source of truth owned by the
   * ingress layer (CloudFront): it sends the policy (with a `{nonce}` placeholder)
   * as `x-csp-template`, and the app only substitutes the per-request nonce. When
   * the header is absent the app falls back to its own bundled policy, so ownership
   * can transfer without an app redeploy. NB: the ingress MUST strip any
   * client-supplied `x-csp-template` so it cannot be spoofed.
   *
   * NB: nonce-ing React 19's streaming Suspense scripts additionally requires the
   * `yarn patch` on `next` that forwards the nonce into `renderToInitialFizzStream`
   * (see .yarn/patches/next-npm-*.patch) — Next 16's pages router omits it.
   */
  csp?: (nonce: string, template?: string) => string
}

/**
 * Request header the ingress (CloudFront) uses to hand the app its CSP policy
 * (with a `{nonce}` placeholder). Stripped before Next sees the request.
 */
const CSP_TEMPLATE_HEADER = 'x-csp-template'

const startServer = (app: Express, port = 4200) => {
  const nextPort = parseInt(process.env.PORT || '') || port
  const metricsPort = nextPort + 1
  app.listen(nextPort, () => {
    logger.info(
      `Next custom server listening at http://localhost:${nextPort}`,
      {
        context: 'Bootstrap',
      },
    )
  })
  startMetricServer(metricsPort)
}

const setupExitHook = () => {
  // Make sure the server doesn't hang after parent process disconnects, eg when
  // e2e tests are finished.
  if (process.env.NX_INVOKED_BY_RUNNER === 'true') {
    process.on('disconnect', () => {
      process.exit(0)
    })
  }
}

export const bootstrap = async (options: BootstrapOptions) => {
  const dev = process.env.NODE_ENV !== 'production'
  monkeyPatchServerLogging()

  setupExitHook()

  const expressApp = createExpressApp()

  await setupProxy(expressApp, options.proxyConfig, dev)

  const nextConfig = await getNextConfig(options.appDir, dev)
  const nextApp = next(nextConfig)
  const handle = nextApp.getRequestHandler()
  const readyPromise = nextApp.prepare()

  setupHealthchecks(
    expressApp,
    readyPromise,
    options.externalEndpointDependencies,
  )

  expressApp.use(async (req, res) => {
    // Configure long caching for web fonts (often in public folder).
    if (req.url.match('.woff2?$')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000') // 365 days
    }

    // Per-request nonce CSP for document requests. Setting it on req.headers is
    // what Next reads to nonce its inline scripts; the response header is what
    // the browser enforces (same nonce). Skip static assets — only documents
    // carry scripts, and a 2kB header on every asset is wasteful.
    if (
      options.csp &&
      !/\/_next\/(static|image)|\.(?:js|css|map|json|png|jpe?g|gif|svg|webp|ico|woff2?|ttf)(?:\?|$)/.test(
        req.url,
      )
    ) {
      const nonce = randomBytes(16).toString('base64')
      // Ingress-owned policy template (single source of truth). Strip it before
      // Next sees the request so a client-supplied value can never leak through.
      const template = req.headers[CSP_TEMPLATE_HEADER]
      delete req.headers[CSP_TEMPLATE_HEADER]
      const policy = options.csp(
        nonce,
        typeof template === 'string' ? template : undefined,
      )
      req.headers['content-security-policy'] = policy
      res.setHeader('Content-Security-Policy', policy)
    }

    try {
      await handle(req, res)
    } catch (err: any) {
      logger.error('Error in Next.js request handler!', {
        message: err.message,
        stack: err.stack,
        err,
      })
      res.status(500).send('Internal Server Error')
    }
  })

  startServer(expressApp, options.port)

  await readyPromise
}
