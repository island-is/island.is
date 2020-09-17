import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentitiesController } from './user-identities.controller'
import { UserProfilesController } from './user-profiles.controller'
import {
  UserIdentity,
  UserProfile,
  UserProfilesService,
  Claim,
  UserIdentitiesService,
} from '@island.is/auth-api'

@Module({
  imports: [SequelizeModule.forFeature([Claim, UserIdentity, UserProfile])],
  controllers: [UserIdentitiesController, UserProfilesController],
  providers: [UserIdentitiesService, UserProfilesService],
})
export class UsersModule {}
