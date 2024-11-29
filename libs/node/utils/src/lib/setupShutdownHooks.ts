import { logger } from '@island.is/logging'
import { Server } from 'http'

export const setupShutdownHooks = (
  server: Server,
  onShutdown?: () => Promise<void>,
) => {
  let isShuttingDown = false
  const terminationEvents: Array<NodeJS.Signals | 'disconnect'> = [
    'SIGHUP',
    'SIGINT',
    'SIGTERM',
  ]

  // Make sure the server doesn't hang after parent process disconnects, eg when
  // e2e tests are finished.
  if (process.env.NX_INVOKED_BY_RUNNER === 'true') {
    terminationEvents.push('disconnect')
  }

  const shutdown = async (signal: string) => {
    if (isShuttingDown) {
      return
    }
    isShuttingDown = true

    try {
      logger.info(`Received ${signal}, shutting down...`)
      await new Promise((resolve) => server.close(resolve))
      if (onShutdown) {
        await onShutdown()
      }
      logger.info('Server closed successfully')
      process.exit(0)
    } catch (error) {
      logger.error('Error during shutdown:', error)
      process.exit(1)
    }
  }

  for (const signal of terminationEvents) {
    process.on(signal, () => shutdown(signal))
  }
}
