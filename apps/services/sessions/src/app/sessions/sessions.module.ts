import { BullModule as NestBullModule } from '@nestjs/bull'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { createRedisCluster } from '@island.is/cache'

import {
  bullModuleName,
  SessionsConfig,
  sessionsQueueName,
} from '../sessions.config'
import { Session } from './session.model'
import { SessionsController } from './sessions.controller'
import { SessionsService } from './sessions.service'

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true' || process.env.TESTS === 'true') {
  BullModule = NestBullModule.registerQueueAsync({
    name: sessionsQueueName,
    useFactory: () => ({}),
  })
} else {
  BullModule = NestBullModule.registerQueueAsync({
    name: sessionsQueueName,
    useFactory: (config: ConfigType<typeof SessionsConfig>) => ({
      prefix: `{${bullModuleName}}`,
      defaultJobOptions: {
        removeOnComplete: { age: 5 * 60 },
        removeOnFail: { age: 14 * 24 * 60 * 60 }, // 2 weeks
      },
      createClient: () =>
        createRedisCluster({
          name: bullModuleName,
          nodes: config.redis.nodes,
          ssl: config.redis.ssl,
          noPrefix: true,
        }),
    }),
    inject: [SessionsConfig.KEY],
  })
}

@Module({
  imports: [SequelizeModule.forFeature([Session]), BullModule],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [BullModule, SessionsService],
})
export class SessionsModule {}
