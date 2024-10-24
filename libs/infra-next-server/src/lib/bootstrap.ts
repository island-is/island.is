// import '@island.is/infra-tracing'

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
}

const startServer = (app: Express, port = 4200) => {
  logger.debug('Setting up server...', { port })
  const nextPort = parseInt(process.env.PORT || '') || port
  const metricsPort = nextPort + 1
  app.listen(nextPort, () => {
    logger.debug('Server is listening...', { nextPort })
    logger.info(
      `Next custom server listening at http://localhost:${nextPort}`,
      {
        context: 'Bootstrap',
      },
    )
  })
  logger.debug('Starting metric server...', { metricsPort })
  startMetricServer(metricsPort)
}

logger.debug('Setting up exit hook...')
const setupExitHook = () => {
  logger.debug('Checking exit hook...', {
    NX_INVOKED_BY_RUNNER: process.env.NX_INVOKED_BY_RUNNER,
  })
  if (process.env.NX_INVOKED_BY_RUNNER === 'true') {
    process.on('disconnect', () => {
      logger.debug('Exiting process...')
      process.exit(0)
    })
  }
}

logger.debug('Starting bootstrap...')
export const bootstrap = async (options: BootstrapOptions) => {
  logger.debug('Checking environment...', { NODE_ENV: process.env.NODE_ENV })
  const dev = process.env.NODE_ENV !== 'production'
  monkeyPatchServerLogging()

  setupExitHook()

  logger.debug('Creating Express app...')
  const expressApp = createExpressApp()

  logger.debug('Setting up proxy...', { proxyConfig: options.proxyConfig, dev })
  // await setupProxy(expressApp, options.proxyConfig, dev)

  logger.debug('Getting Next.js config...', { appDir: options.appDir, dev })
  const nextConfig = await getNextConfig(options.appDir, dev)
  const nextApp = next(nextConfig)
  const handle = nextApp.getRequestHandler()
  const readyPromise = nextApp.prepare()
  logger.debug(`Next.js config:`, {
    nextConfig,
    handle,
    handleType: typeof handle,
    readyPromise,
  })

  logger.debug('Setting up healthchecks...', {
    externalEndpointDependencies: options.externalEndpointDependencies,
  })
  // setupHealthchecks(
  //   expressApp,
  //   readyPromise,
  //   options.externalEndpointDependencies,
  // )

  expressApp.use(async (req, res) => {
    // if (req.url.match('.woff2?$')) {
    //   res.setHeader('Cache-Control', 'public, max-age=31536000')
    // }

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

  logger.debug('Starting server...', { port: options.port })
  startServer(expressApp, options.port)

  logger.debug('Starting next...')
  await readyPromise
}
