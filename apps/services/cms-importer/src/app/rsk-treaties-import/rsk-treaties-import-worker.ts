import { NestFactory } from '@nestjs/core'
import { logger } from '@island.is/logging'
import { RskTreatiesImportModule } from './rsk-treaties-import.module'
import { RskTreatiesImportService } from './rsk-treaties-import.service'

export const rskTreatiesImportWorker = async () => {
  const limitArgIndex = process.argv.indexOf('--limit')
  const limit =
    limitArgIndex !== -1 ? Number(process.argv[limitArgIndex + 1]) : undefined

  try {
    logger.info('RSK treaties import worker job initiating...', { limit })
    const app = await NestFactory.createApplicationContext(
      RskTreatiesImportModule,
    )
    app.enableShutdownHooks()
    await app.get(RskTreatiesImportService).run({ limit })
    await app.close()
    logger.info('RSK treaties import worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('RSK treaties import worker encountered an error:', error)
    process.exit(1)
  }
}
