import { NestFactory } from '@nestjs/core'

import { logger } from '@island.is/logging'

import { FjsWorkerModule } from './fjsWorker.module'
import { FjsWorkerService } from './fjsWorker.service'

export const worker = async () => {
  try {
    logger.info('FJS worker starting.')
    const app = await NestFactory.createApplicationContext(FjsWorkerModule)
    app.enableShutdownHooks()

    await app.get(FjsWorkerService).run()

    await app.close()
    logger.info('FJS worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('FJS worker encountered an error:', error)
    process.exit(1)
  }
}
