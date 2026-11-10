import { logger } from '@island.is/logging'
import { NestFactory } from '@nestjs/core'
import { AdStaffImportModule } from './ad-staff-import.module'
import { AdStaffImportService } from './ad-staff-import.service'

export const adStaffImportWorker = async () => {
  try {
    logger.info('Cms AD staff import worker job initiated')
    const app = await NestFactory.createApplicationContext(AdStaffImportModule)

    app.enableShutdownHooks()
    await app.get(AdStaffImportService).run()
    await app.close()
    logger.info('Cms AD staff import worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Cms AD staff import worker encountered an error:', error)
    process.exit(1)
  }
}
