import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileStorageModule } from '@island.is/file-storage'
import { createRedisCluster } from '@island.is/cache'

import { Application } from './application.model'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { UploadProcessor } from './upload.processor'
import { environment } from '../../../environments'

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  const bullModuleName = 'application_system_api_bull_module'
  const redisClient = createRedisCluster({
    name: bullModuleName,
    ssl: environment.production,
    nodes: environment.redis.urls,
  })
  BullModule = NestBullModule.registerQueueAsync({
    name: 'upload',
    useFactory: () => ({
      prefix: `{${bullModuleName}}`,
      createClient: () => redisClient,
    }),
  })
}

@Module({
  imports: [
    SequelizeModule.forFeature([Application]),
    FileStorageModule,
    BullModule,
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, UploadProcessor],
})
export class ApplicationModule {}
