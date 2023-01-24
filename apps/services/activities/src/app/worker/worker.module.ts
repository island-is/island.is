import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { BullModule as NestBullModule } from '@nestjs/bull'

import { ActivitiesProcessor } from './activities.processor'
import { createRedisCluster } from '@island.is/cache'
import { SequelizeConfigService } from '../../sequelizeConfig.service'
import { LoggingModule } from '@island.is/logging'
import { Session } from '../sessions/session.model'
import {
  ActivitiesConfig,
  activitiesQueueName,
  bullModuleName,
} from '../activities.config'
import { SessionsService } from '../sessions/sessions.service'

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  BullModule = NestBullModule.registerQueueAsync({
    name: activitiesQueueName,
    useFactory: (config: ConfigType<typeof ActivitiesConfig>) => ({
      prefix: `{${bullModuleName}}`,
      createClient: () =>
        createRedisCluster({
          name: bullModuleName,
          nodes: config.redis.nodes,
          ssl: config.redis.ssl,
          noPrefix: true,
        }),
    }),
    inject: [ActivitiesConfig.KEY],
  })
}

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Session]),
    BullModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ActivitiesConfig],
    }),
  ],
  providers: [ActivitiesProcessor, SessionsService],
})
export class WorkerModule {}
