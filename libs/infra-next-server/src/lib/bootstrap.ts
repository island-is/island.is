import next from 'next'
import { logger } from '@island.is/logging'
import { startMetricServer } from '@island.is/infra-metrics'
import createExpressApp, { Express } from 'express'

type BootstrapOptions = {
  /**
   * Server name.
   */
  name: string

  /**
   * Server port.
   */
  port?: number
}

const startServer = async (app: Express, port = 4200) => {
  const nextPort = parseInt(process.env.PORT || '') || port
  const metricsPort = nextPort + 1
  await app.listen(nextPort, () => {
    logger.info(
      `Next custom server listening at http://localhost:${nextPort}`,
      {
        context: 'Bootstrap',
      },
    )
  })
  await startMetricServer(metricsPort)
}

const monkeyPatchServerLogging = () => {
  // NextJS internally uses console functions directly, eg on error. It's also
  // rare to load a logging library in react code.
  console.log = logger.info.bind(logger)
  console.warn = logger.warn.bind(logger)
  console.error = logger.error.bind(logger)
}

export const bootstrap = async (options: BootstrapOptions) => {
  monkeyPatchServerLogging()

  const nextApp = next({ dev: false })
  const handle = nextApp.getRequestHandler()
  await nextApp.prepare()

  const expressApp = createExpressApp()

  expressApp.use((req, res) => {
    handle(req, res)
  })

  startServer(expressApp, options.port)
}
