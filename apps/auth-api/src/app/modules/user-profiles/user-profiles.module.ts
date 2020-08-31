import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfilesService } from './user-profiles.service'
import { UserProfilesController } from './user-profiles.controller'
import { UserProfile } from './user-profile.model'
import { ConfigModule } from '@nestjs/config'
import environment from './../../../environments/environment'

@Module({
  imports: [
    SequelizeModule.forFeature([UserProfile]),
    ConfigModule.forFeature(
      environment
    )
  ],
  controllers: [UserProfilesController],
  providers: [
    UserProfilesService
  ],
})
export class UserProfilesModule {}
