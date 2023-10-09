import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuditModule } from '@island.is/nest/audit'
import environment from '../../environments/environment'
import { AuthModule } from '@island.is/auth-nest-tools'
import { MeUserProfileController } from './me-user-profile.controller'
import { UserProfileService } from './user-profile.service'
import { UserProfile } from './userProfileV2.model'
import { EmailVerification } from '../user-profile/emailVerification.model'
import { EmailModule } from '@island.is/email-service'
import { SmsVerification } from '../user-profile/smsVerification.model'
import { SmsModule } from '@island.is/nova-sms'
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
export class V2UserProfileModule {}
