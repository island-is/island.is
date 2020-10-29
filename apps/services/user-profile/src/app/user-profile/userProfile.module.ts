import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserProfileController } from './userProfile.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { SmsService, SmsServiceOptions, SMS_OPTIONS } from '@island.is/nova-sms'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { DataSourceConfig } from 'apollo-datasource'
import environment from '../../environments/environment'
import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'
import { SmsVerification } from './sms-verification.model'
import { EmailVerification } from './email-verification.model'
import { VerificationService } from './verification.service'

@Module({
  imports: [
    SequelizeModule.forFeature([
      EmailVerification,
      SmsVerification,
      UserProfile,
    ]),
  ],
  controllers: [UserProfileController],
  providers: [
    UserProfileService,
    VerificationService,
    EmailService,
    {
      provide: SMS_OPTIONS,
      useValue: environment.smsOptions,
    },
    {
      provide: EMAIL_OPTIONS,
      useValue: environment.emailOptions,
    },
    {
      provide: SmsService,
      useFactory: (options: SmsServiceOptions, logger: Logger) => {
        const smsService = new SmsService(options, logger)
        smsService.initialize({} as DataSourceConfig<{}>)
        return smsService
      },
      inject: [SMS_OPTIONS, LOGGER_PROVIDER],
    },
  ],
  exports: [UserProfileService],
})
export class UserProfileModule { }
