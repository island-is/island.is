import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfileController } from './userProfile.controller'
import { UserTokenController } from './userToken.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { SmsModule } from '@island.is/nova-sms'
import { EmailModule } from '@island.is/email-service'
import { SmsVerification } from './smsVerification.model'
import { EmailVerification } from './emailVerification.model'
import { VerificationService } from './verification.service'
import { UserProfileInfraController } from './userProfileInfra.controller'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { UserDeviceTokens } from './userDeviceTokens.model'
import { Emails } from '../v2/models/emails.model'

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmailVerification,
      SmsVerification,
      UserProfile,
      UserDeviceTokens,
      Emails,
    ]),
    EmailModule,
    SmsModule,
  ],
  controllers: [
    UserProfileController,
    UserProfileInfraController,
    UserTokenController,
  ],
  providers: [UserProfileService, VerificationService, SequelizeConfigService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
