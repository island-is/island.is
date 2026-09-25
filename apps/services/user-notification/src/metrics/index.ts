import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { Client } from 'pg'
import { LoggingModule, LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { publishSnapshot } from '@island.is/infra-metrics'
import { SequelizeConfigService } from '../app/sequelizeConfig.service'
import { collectNotificationMetrics } from './collect'

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
          },
          hooks: {
            ...options.hooks,
            afterConnect: async (connection: unknown) => {
              await (connection as Client).query(
                'SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY',
              )
            },
          },
        }
      },
    }),
  ],
})
class MetricsModule {}

export const metrics = async () => {
  await publishSnapshot('user-notification', async () => {
    const app = await NestFactory.createApplicationContext(MetricsModule, {
      abortOnError: false,
    })
    app.enableShutdownHooks()
    try {
      return await collectNotificationMetrics(app.get(Sequelize))
    } finally {
      await app.close()
    }
  })
}
