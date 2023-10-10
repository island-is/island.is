import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuditModule } from '@island.is/nest/audit'

import { AuthModule } from '@island.is/auth-nest-tools'
import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import environment from '../../environments/environment'
import { MeUserProfileController } from './me-user-profile.controller'
import { UserProfile } from './userProfileV2.model'
import { UserProfileService } from './user-profile.service'
import { EmailVerification } from '../user-profile/emailVerification.model'
import { SmsVerification } from '../user-profile/smsVerification.model'
import { VerificationService } from '../user-profile/verification.service'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forFeature([
      UserProfile,
      EmailVerification,
      SmsVerification,
    ]),
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
  ],
  controllers: [MeUserProfileController],
  providers: [UserProfileService, VerificationService],
})
export class UserProfileModule {}
