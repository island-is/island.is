import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { EmailModule } from '@island.is/email-service'
import { AuditModule } from '@island.is/nest/audit'
import { SmsModule } from '@island.is/nova-sms'

import environment from '../../environments/environment'
import { SequelizeConfigService } from '../sequelizeConfig.service'

import { EmailVerification } from './emailVerification.model'
import { SmsVerification } from './smsVerification.model'
import { UserDeviceTokens } from './userDeviceTokens.model'
import { UserProfileController } from './userProfile.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { UserProfileInfraController } from './userProfileInfra.controller'
import { UserTokenController } from './userToken.controller'
import { VerificationService } from './verification.service'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forFeature([
      EmailVerification,
      SmsVerification,
      UserProfile,
      UserDeviceTokens,
    ]),
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
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
