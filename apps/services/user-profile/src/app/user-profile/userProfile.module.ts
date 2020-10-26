import { DynamicModule, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { UserProfileController } from './userProfile.controller'
import { UserProfile } from './userProfile.model'
import { UserProfileService } from './userProfile.service'
import { UploadProcessor } from './upload.processor'
import { FileStorageService } from '@island.is/file-storage'
import { VerificationService } from '../verification/verification.service'
import { EmailVerification } from '../verification/email-verification.model'
import { SmsVerification } from '../verification/sms-verification.model'
import { SmsService, SmsServiceOptions, SMS_OPTIONS } from '@island.is/nova-sms'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { DataSourceConfig } from 'apollo-datasource'
import environment from '../../environments/environment'
import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'


let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  BullModule = NestBullModule.registerQueueAsync({
    name: 'upload',
    useFactory: () => ({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  })
}

@Module({
  imports: [SequelizeModule.forFeature([EmailVerification, SmsVerification, UserProfile]), BullModule],
  controllers: [UserProfileController],
  providers: [UserProfileService, UploadProcessor, FileStorageService, VerificationService,
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
    }],
  exports: [UserProfileService],
})
export class UserProfileModule { }
