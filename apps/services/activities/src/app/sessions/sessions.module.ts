import { createRedisCluster } from '@island.is/cache';
import { BullModule as NestBullModule } from '@nestjs/bull';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { ActivitiesConfig, activitiesQueueName, bullModuleName } from '../activities.config';
import { Session } from './session.model';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true' || process.env.TESTS === 'true') {
  BullModule = NestBullModule.registerQueueAsync({
    name: activitiesQueueName,
    useFactory: () => ({}),
  })
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
    SequelizeModule.forFeature([Session]),
    BullModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ActivitiesConfig],
    }),
  ],
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [BullModule, SessionsService],
})
export class SessionsModule {}
