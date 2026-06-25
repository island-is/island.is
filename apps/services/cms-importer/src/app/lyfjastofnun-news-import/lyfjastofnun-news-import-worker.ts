import { logger } from '@island.is/logging'
import { NestFactory } from '@nestjs/core'
import { LyfjastofnunNewsImportModule } from './lyfjastofnun-news-import.module'
import { LyfjastofnunNewsImportService } from './lyfjastofnun-news-import.service'

export const lyfjastofnunNewsImportWorker = async () => {
  const publish = process.argv.includes('--publish')
  const slugArgIndex = process.argv.indexOf('--slug')
  const slug = slugArgIndex !== -1 ? process.argv[slugArgIndex + 1] : undefined
  try {
    logger.info('Lyfjastofnun news import worker job initiating...', {
      publish,
      slug,
    })
    const app = await NestFactory.createApplicationContext(
      LyfjastofnunNewsImportModule,
    )
    app.enableShutdownHooks()
    await app.get(LyfjastofnunNewsImportService).run({ publish, slug })
    await app.close()
    logger.info('Lyfjastofnun news import worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Lyfjastofnun news import worker encountered an error:', error)
    process.exit(1)
  }
}
