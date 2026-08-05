import { logger } from '@island.is/logging'
import { NestFactory } from '@nestjs/core'
import { CmsCleanupModule } from './cms-cleanup.module'
import { CmsCleanupService } from './cms-cleanup.service'

export const cmsCleanupWorker = async () => {
  try {
    logger.info('CMS cleanup worker job initiating...')
    const app = await NestFactory.createApplicationContext(CmsCleanupModule)
    app.enableShutdownHooks()
    await app.get(CmsCleanupService).run()
    await app.close()
    logger.info('CMS cleanup worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('CMS cleanup worker encountered an error:', error)
    process.exit(1)
  }
}
