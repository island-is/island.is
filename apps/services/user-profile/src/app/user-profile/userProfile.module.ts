import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfileController } from './userProfile.controller'
import { UserTokenController } from './userToken.controller'
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
import { UserDeviceTokens } from './userDeviceTokens.model'
import { IslykillClientModule } from '@island.is/clients/islykill'

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
    IslykillClientModule,
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
