import { DataSourceConfig } from 'apollo-datasource'

import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { UserModule } from '../user'
import { CaseModule } from '../case'
import { Notification } from '../case/models'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { SmsService, SmsServiceOptions, SMS_OPTIONS } from '@island.is/nova-sms'
import { environment } from '../../../environments'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { EmailService, EMAIL_OPTIONS } from '@island.is/email-service'

@Module({
  imports: [UserModule, CaseModule, SequelizeModule.forFeature([Notification])],
  providers: [
    NotificationService,
    {
      provide: SMS_OPTIONS,
      useValue: environment.smsOptions,
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
    {
      provide: EMAIL_OPTIONS,
      useValue: environment.emailOptions,
    },
    EmailService,
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
