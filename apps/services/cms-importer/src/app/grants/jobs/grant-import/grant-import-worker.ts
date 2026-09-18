import { logger } from '@island.is/logging'
import { NestFactory } from '@nestjs/core'
import { GrantImportModule } from './grant-import.module'
import { GrantImportService } from './grant-import.service'

export const worker = async () => {
  try {
    logger.info('Cms grant import worker job initiated')
    const app = await NestFactory.createApplicationContext(GrantImportModule)

    app.enableShutdownHooks()
    await app.get(GrantImportService).run()
    await app.close()
    logger.info('Cms grant import worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Cms grant import worker encountered an error:', error)
    process.exit(1)
  }
}
