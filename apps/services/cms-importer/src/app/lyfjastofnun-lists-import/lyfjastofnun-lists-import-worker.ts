import { NestFactory } from '@nestjs/core'
import { logger } from '@island.is/logging'
import { LyfjastofnunListsImportModule } from './lyfjastofnun-lists-import.module'
import { LyfjastofnunListsImportService } from './lyfjastofnun-lists-import.service'

export const lyfjastofnunListsImportWorker = async () => {
  const publish = process.argv.includes('--publish')
  const limitArgIndex = process.argv.indexOf('--limit')
  const limit =
    limitArgIndex !== -1
      ? Number(process.argv[limitArgIndex + 1])
      : undefined
  try {
    logger.info('Lyfjastofnun lists import worker job initiating...', {
      publish,
      limit,
    })
    const app = await NestFactory.createApplicationContext(
      LyfjastofnunListsImportModule,
    )
    app.enableShutdownHooks()
    await app.get(LyfjastofnunListsImportService).run({ publish, limit })
    await app.close()
    logger.info('Lyfjastofnun lists import worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error(
      'Lyfjastofnun lists import worker encountered an error:',
      error,
    )
    process.exit(1)
  }
}
