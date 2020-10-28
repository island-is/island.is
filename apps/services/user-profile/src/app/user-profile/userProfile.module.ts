import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { UserProfileController } from './userProfile.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { FileStorageService } from '@island.is/file-storage'

@Module({
  imports: [SequelizeModule.forFeature([UserProfile])],
  controllers: [UserProfileController],
  providers: [UserProfileService, FileStorageService],
})
export class UserProfileModule {}
