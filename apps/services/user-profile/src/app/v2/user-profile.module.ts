import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import { MeUserProfileController } from './me-user-profile.controller'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileService } from './user-profile.service'
import { EmailVerification } from '../user-profile/emailVerification.model'
import { SmsVerification } from '../user-profile/smsVerification.model'
import { VerificationService } from '../user-profile/verification.service'
import { UserProfileController } from './user-profile.controller'
import { UserTokenController } from './userToken.controller'
import { UserTokenService } from './userToken.service'
import { UserDeviceTokens } from '../user-profile/userDeviceTokens.model'
import { ActorProfile } from './models/actor-profile.model'
import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'

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
  ],
  providers: [
    UserProfileService,
    VerificationService,
    UserTokenService,
  ],
})
export class UserProfileModule {}
