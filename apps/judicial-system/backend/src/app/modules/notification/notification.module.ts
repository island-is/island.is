import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SmsModule } from '@island.is/nova-sms'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

import { environment } from '../../../environments'
import {
  CaseModule,
  UserModule,
  CourtModule,
  EventModule,
  AwsS3Module,
  DefendantModule,
} from '../index'
import { Notification } from './models/notification.model'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { InternalNotificationController } from './internalNotification.controller'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
    CmsTranslationsModule,
    forwardRef(() => CaseModule),
    forwardRef(() => UserModule),
    forwardRef(() => CourtModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => EventModule),
    forwardRef(() => DefendantModule),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController, InternalNotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
