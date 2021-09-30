import '@island.is/infra-tracing'
import next from 'next'
import { logger, monkeyPatchServerLogging } from '@island.is/logging'
import { startMetricServer } from '@island.is/infra-metrics'
import createExpressApp, { Express } from 'express'
import { getNextConfig } from './config'
import { setupProxy } from './proxy'
import type { Config } from 'http-proxy-middleware'

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
  proxyConfig?: { [context: string]: Config }
}

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
  expressApp.all('*', (req, res) => handle(req, res))

  startServer(expressApp, options.port)

  await nextApp.prepare()
}
