import { Module } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SequelizeModule } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import type { Client } from 'pg'
import { LoggingModule, LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { publishSnapshot } from '@island.is/infra-metrics'
import { ConfigModule } from '@island.is/nest/config'
import {
  FeatureFlagConfig,
  FeatureFlagModule,
  FeatureFlagService,
} from '@island.is/nest/feature-flags'
import { Features } from '@island.is/feature-flags'
import { SequelizeConfigService } from '../app/sequelizeConfig.service'
import { collectProfileMetrics } from './collect'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FeatureFlagConfig],
    }),
    FeatureFlagModule,
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

export const collectEnabledProfileMetrics = async (
  featureFlagService: FeatureFlagService,
  db: Sequelize,
) => {
  const enabled = await featureFlagService.getValue(
    Features.isUserProfileAllNotificationChannelsDisabledMetricEnabled,
    false,
  )

  return enabled ? collectProfileMetrics(db) : []
}

export const metrics = async () => {
  await publishSnapshot('user-profile', async () => {
    const app = await NestFactory.createApplicationContext(MetricsModule, {
      abortOnError: false,
    })
    app.enableShutdownHooks()
    try {
      return await collectEnabledProfileMetrics(
        app.get(FeatureFlagService),
        app.get(Sequelize),
      )
    } finally {
      await app.close()
    }
  })
}
