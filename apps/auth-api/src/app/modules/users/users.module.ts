import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserIdentity } from './user-identity.model'
import { UserIdentitiesController } from './user-identities.controller'
import { UserIdentitiesService } from './user-identities.service'
import { Claim } from './claim.model'
import { UserProfilesController } from './user-profiles.controller'
import { UserProfilesService } from './user-profiles.service'
import { UserProfile } from './user-profile.model'

@Module({
  imports: [SequelizeModule.forFeature([Claim, UserIdentity, UserProfile])],
  controllers: [UserIdentitiesController, UserProfilesController],
  providers: [UserIdentitiesService, UserProfilesService],
})
export class UsersModule {}
