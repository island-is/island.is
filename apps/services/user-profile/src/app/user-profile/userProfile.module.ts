import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfileController } from './userProfile.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { SmsModule } from '@island.is/nova-sms'
import environment from '../../environments/environment'
import { EmailModule } from '@island.is/email-service'
import { SmsVerification } from './smsVerification.model'
import { EmailVerification } from './emailVerification.model'
import { VerificationService } from './verification.service'
import { UserProfileInfraController } from './userProfileInfra.controller'
import { SequelizeConfigService } from '../sequelizeConfig.service'
import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forFeature([
      EmailVerification,
      SmsVerification,
      UserProfile,
    ]),
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
  ],
  controllers: [UserProfileController, UserProfileInfraController],
  providers: [UserProfileService, VerificationService, SequelizeConfigService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
