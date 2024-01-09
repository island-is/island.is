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

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserProfile,
      EmailVerification,
      SmsVerification,
    ]),
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
    IslykillApiModule.register({
      basePath: environment.islykillConfig.basePath,
      cert: environment.islykillConfig.cert,
      passphrase: environment.islykillConfig.passphrase,
    }),
  ],
  controllers: [MeUserProfileController, UserProfileController],
  providers: [UserProfileService, VerificationService, IslykillService],
})
export class UserProfileModule {}
