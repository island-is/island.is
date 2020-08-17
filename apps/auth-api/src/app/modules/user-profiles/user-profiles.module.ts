import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfilesService } from './user-profiles.service'
import { UserProfilesController } from './user-profiles.controller'
import { UserProfile } from './user-profile.model'

@Module({
  imports: [
    SequelizeModule.forFeature([UserProfile])
  ],
  controllers: [UserProfilesController],
  providers: [
    UserProfilesService
  ],
})
export class UserProfilesModule {}
