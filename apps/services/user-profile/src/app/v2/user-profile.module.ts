import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { IslykillApiModule } from '@island.is/clients/islykill'
import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import environment from '../../environments/environment'
import { MeUserProfileController } from './me-user-profile.controller'
import { UserProfile } from '../user-profile/userProfile.model'
import { UserProfileService } from './user-profile.service'
import { EmailVerification } from '../user-profile/emailVerification.model'
import { SmsVerification } from '../user-profile/smsVerification.model'
import { VerificationService } from '../user-profile/verification.service'
import { IslykillService } from './islykill.service'
import { UserProfileController } from './user-profile.controller'
import { UserTokenController } from './userToken.controller'
import { UserTokenService } from './userToken.service'
import { UserDeviceTokens } from '../user-profile/userDeviceTokens.model'
import { ActorProfile } from './models/actor-profile.model'
import { AuthDelegationApiClientModule } from '@island.is/clients/auth/delegation-api'
import { Emails } from './models/emails.model'
import { EmailsController } from './emails.controller'
import { EmailsService } from './emails.service'
import { ActorUserProfileController } from './actor-user-profile.controller'

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserProfile,
      EmailVerification,
      SmsVerification,
      UserDeviceTokens,
      ActorProfile,
      Emails,
    ]),
    EmailModule,
    SmsModule,
    IslykillApiModule.register({
      ...environment.islykillConfig,
    }),
    AuthDelegationApiClientModule,
  ],
  controllers: [
    MeUserProfileController,
    UserProfileController,
    UserTokenController,
    ActorUserProfileController,
    EmailsController,
  ],
  providers: [
    UserProfileService,
    VerificationService,
    IslykillService,
    UserTokenService,
    EmailsService,
  ],
})
export class UserProfileModule {}
