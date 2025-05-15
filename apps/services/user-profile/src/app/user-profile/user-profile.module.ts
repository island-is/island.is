import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import { MeUserProfileController } from './me-user-profile.controller'
import { UserProfile } from './models/userProfile.model'
import { UserProfileService } from './user-profile.service'
import { EmailVerification } from './models/emailVerification.model'
import { SmsVerification } from './models/smsVerification.model'
import { VerificationService } from './verification.service'
import { UserProfileController } from './user-profile.controller'
import { UserTokenController } from './userToken.controller'
import { UserTokenService } from './userToken.service'
import { UserDeviceTokens } from './models/userDeviceTokens.model'
import { ActorProfile } from './models/actor-profile.model'
import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'
import { ActorUserProfileController } from './actor-user-profile.controller'
@Module({
  imports: [
    SequelizeModule.forFeature([
      UserProfile,
      EmailVerification,
      SmsVerification,
      UserDeviceTokens,
      ActorProfile,
    ]),
    EmailModule,
    SmsModule,
    AuthDelegationApiClientModule,
  ],
  controllers: [
    MeUserProfileController,
    UserProfileController,
    UserTokenController,
    ActorUserProfileController,
  ],
  providers: [UserProfileService, VerificationService, UserTokenService],
})
export class UserProfileModule {}
