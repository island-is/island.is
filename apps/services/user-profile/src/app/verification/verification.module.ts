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

@Module({
  imports: [UserProfileModule, SequelizeModule.forFeature([EmailVerification, SmsVerification, UserProfile])],
  controllers: [VerificationController],
  providers: [VerificationService,
    UserProfileService,
    UserProfileByNationalIdPipe
    {
      provide: SmsService,
      useFactory: (options: SmsServiceOptions, logger: Logger) => {
        const smsService = new SmsService(options, logger)
        smsService.initialize({} as DataSourceConfig<{}>)
        return smsService
      },
      inject: [SMS_OPTIONS, LOGGER_PROVIDER],
    }
  ],
  exports: [VerificationService],
})
export class VerificationModule { };
