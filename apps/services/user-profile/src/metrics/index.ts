import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { LoggingModule, LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { publishSnapshot } from '@island.is/infra-metrics'
import { SequelizeConfigService } from '../app/sequelizeConfig.service'
import { collectProfileMetrics } from './collect'

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      imports: [LoggingModule],
      inject: [LOGGER_PROVIDER],
      useFactory: (logger: Logger) => {
        const options = new SequelizeConfigService(
          logger,
        ).createSequelizeOptions()
        return {
          ...options,
          retryAttempts: 1,
          pool: { ...options.pool, max: 1 },
          dialectOptions: {
            ...options.dialectOptions,
            statement_timeout: 60000,
            options: '-c default_transaction_read_only=on',
          },
        }
      },
    }),
  ],
})
class MetricsModule {}

export const metrics = async () => {
  await publishSnapshot('user-profile', async () => {
    const app = await NestFactory.createApplicationContext(MetricsModule, {
      abortOnError: false,
    })
    app.enableShutdownHooks()
    try {
      return await collectProfileMetrics(app.get(Sequelize))
    } finally {
      await app.close()
    }
  })
}
