import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { SequelizeModule } from '@nestjs/sequelize'
import { Application } from './application.model'
import { ApplicationController } from './application.controller'
import { ApplicationService } from './application.service'
import { FileStorageModule } from '@island.is/file-storage'
import { UploadProcessor } from './upload.processor'

@Module({
  imports: [
    SequelizeModule.forFeature([Application]),
    FileStorageModule,
    BullModule.registerQueueAsync({
      name: 'upload',
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, UploadProcessor],
})
export class ApplicationModule {}
