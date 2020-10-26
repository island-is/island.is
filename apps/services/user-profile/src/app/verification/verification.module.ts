import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProfileByNationalIdPipe } from '../user-profile/pipes/userProfileByNationalId.pipe';
import { UserProfile } from '../user-profile/userProfile.model';
import { UserProfileModule } from '../user-profile/userProfile.module';
import { UserProfileService } from '../user-profile/userProfile.service';
import { EmailVerification } from './email-verification.model';
import { SmsVerification } from './sms-verification.model';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { DataSourceConfig } from 'apollo-datasource'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { SmsService, SmsServiceOptions, SMS_OPTIONS } from '@island.is/nova-sms'
import environment from '../../environments/environment';
import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'

@Module({
  imports: [UserProfileModule, SequelizeModule.forFeature([EmailVerification, SmsVerification, UserProfile])],
  controllers: [VerificationController],
  providers: [
    VerificationService,
    {
      provide: SMS_OPTIONS,
      useValue: environment.smsOptions,
    },
    {
      provide: EMAIL_OPTIONS,
      useValue: environment.emailOptions,
    },
    UserProfileService,
    UserProfileByNationalIdPipe,
    {
      provide: SmsService,
      useFactory: (options: SmsServiceOptions, logger: Logger) => {
        const smsService = new SmsService(options, logger)
        smsService.initialize({} as DataSourceConfig<{}>)
        return smsService
      },
      inject: [SMS_OPTIONS, LOGGER_PROVIDER],
    },
    EmailService,
  ],
  exports: [VerificationService],
})
export class VerificationModule { };
