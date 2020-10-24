import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { UserProfileController } from './userProfile.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { UploadProcessor } from './upload.processor'
import { FileStorageService } from '@island.is/file-storage'
import { UserProfileByNationalIdPipe } from './pipes/userProfileByNationalId.pipe'

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
  imports: [SequelizeModule.forFeature([UserProfile]), BullModule],
  controllers: [UserProfileController],
  providers: [UserProfileService, UploadProcessor, FileStorageService, UserProfileByNationalIdPipe],
  exports: [UserProfileService, SequelizeModule.forFeature([UserProfile]), UserProfileByNationalIdPipe],
})
export class UserProfileModule { }
