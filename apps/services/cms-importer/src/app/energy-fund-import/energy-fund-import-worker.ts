import { logger } from '@island.is/logging'
import { NestFactory } from '@nestjs/core'
import { EnergyFundImportModule } from './energy-fund-import.module'
import { EnergyFundImportService } from './energy-fund-import.service'

export const energyFundWorker = async () => {
  try {
    logger.info('Energy fund import worker job initiating...')
    const app = await NestFactory.createApplicationContext(
      EnergyFundImportModule,
    )
    app.enableShutdownHooks()
    await app.get(EnergyFundImportService).run()
    await app.close()
    logger.info('Energy fund import worker finished successfully.')
    process.exit(0)
  } catch (error) {
    logger.error('Energy fund import worker encountered an error:', error)
    process.exit(1)
  }
}
