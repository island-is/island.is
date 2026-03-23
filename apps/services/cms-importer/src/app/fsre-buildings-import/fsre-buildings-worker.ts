import { logger } from '@island.is/logging'
import { NestFactory } from '@nestjs/core'
import { FSREBuildingsImportModule } from './fsre-buildings.module'
import { FSREBuildingsImportService } from './fsre-buildings.service'

export const fsreBuildingsWorker = async () => {
  try {
    logger.info('Cms fsre-building import worker job initiated')
    const app = await NestFactory.createApplicationContext(
      FSREBuildingsImportModule,
    )

    app.enableShutdownHooks()
    await app.get(FSREBuildingsImportService).run()
    await app.close()
    logger.info('Cms FSRE building import worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Cms FSRE building import worker encountered an error:', error)
    process.exit(1)
  }
}
