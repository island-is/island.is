import { NestFactory } from '@nestjs/core'

import { logger } from '@island.is/logging'

import { WorkerModule } from './worker.module'
import { WorkerService } from './worker.service'

/**
 * Entry point for the FJS backfill worker.
 * Bootstraps the worker module and runs the backfill (paid flows → create missing FJS charges).
 */
export const worker = async () => {
  try {
    logger.info('Worker starting...')
    const app = await NestFactory.createApplicationContext(WorkerModule)
    app.enableShutdownHooks()

    await app.get(WorkerService).run()

    await app.close()
    logger.info('Worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Worker encountered an error:', error)
    process.exit(1)
  }
}
