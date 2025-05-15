import { Module } from '@nestjs/common'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { UserProfileResolver } from './userProfile.resolver'

import { IdentityClientModule } from '@island.is/clients/identity'
import { BankinfoClientModule } from '@island.is/clients/fjs/bankinfo'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { UserProfileService } from './userProfile.service'
import { AdminUserProfileResolver } from './adminUserProfile.resolver'
import { ActorProfileResolver } from './actorProfile.resolver'

@Module({
  providers: [
    UserProfileService,
    UserProfileResolver,
    ActorProfileResolver,
    AdminUserProfileResolver,
  ],
  imports: [
    FeatureFlagModule,
    IdentityClientModule,
    BankinfoClientModule,
    UserProfileClientModule,
    IdentityClientModule,
  ],
  exports: [],
})
export class UserProfileModule {}
