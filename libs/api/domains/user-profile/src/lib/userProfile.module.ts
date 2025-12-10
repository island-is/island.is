import { Module } from '@nestjs/common'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { UserProfileResolver } from './userProfile.resolver'

import { IdentityClientModule } from '@island.is/clients/identity'
import { BankinfoClientModule } from '@island.is/clients/fjs/bank-info'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { UserProfileService } from './userProfile.service'
import { AdminUserProfileResolver } from './adminUserProfile.resolver'
import { ActorProfileResolver } from './actorProfile.resolver'
import { UserEmailsService } from './modules/user-emails/userEmails.service'
import { EmailsLoader } from './modules/user-emails/emails.loader'
import { UserEmailsResolver } from './modules/user-emails/userEmails.resolver'
@Module({
  providers: [
    UserProfileService,
    UserProfileResolver,
    ActorProfileResolver,
    AdminUserProfileResolver,
    UserEmailsResolver,
    UserEmailsService,
    EmailsLoader,
  ],
  imports: [
    FeatureFlagModule,
    IdentityClientModule,
    BankinfoClientModule,
    UserProfileClientModule,
  ],
  exports: [],
})
export class UserProfileModule {}
