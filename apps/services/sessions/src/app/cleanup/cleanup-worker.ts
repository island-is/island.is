import { NestFactory } from '@nestjs/core'

import { logger } from '@island.is/logging'

import { SessionsCleanupWorkerModule } from './cleanup-worker.module'
import { SessionsCleanupService } from './cleanup-worker.service'

export const worker = async () => {
  try {
    logger.info('Sessions cleanup worker starting.')
    const app = await NestFactory.createApplicationContext(
      SessionsCleanupWorkerModule,
    )
    app.enableShutdownHooks()
    await app.get(SessionsCleanupService).run()
    await app.close()
    logger.info('Sessions cleanup worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Sessions cleanup worker encountered an error:', error)
    process.exit(1)
  }
}
