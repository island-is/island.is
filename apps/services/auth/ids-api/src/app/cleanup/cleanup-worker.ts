import { NestFactory } from '@nestjs/core'

import { logger } from '@island.is/logging'

import { CleanupWorkerModule } from './cleanup-worker.module'
import { CleanupService } from './cleanup.service'

export const worker = async () => {
  try {
    logger.info('Cleanup worker starting.')
    const app = await NestFactory.createApplicationContext(CleanupWorkerModule)
    app.enableShutdownHooks()
    await app.get(CleanupService).run()
    await app.close()
    logger.info('Cleanup worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Cleanup worker encountered an error:', error)
    process.exit(1)
  }
}
