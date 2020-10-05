import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileStorageModule } from '@island.is/file-storage'

import { Application } from './application.model'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { UploadProcessor } from './upload.processor'

let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  BullModule = NestBullModule.registerQueueAsync({
    name: 'upload',
    useFactory: () => ({
      redis: {
        host: 'localhost',
        port: 6379,
      },
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
