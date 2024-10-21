import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import { MessageModule } from '@island.is/judicial-system/message'

import {
  CaseModule,
  CourtModule,
  DefendantModule,
  EventModule,
  InstitutionModule,
  SubpoenaModule,
  UserModule,
} from '../index'
import { Notification } from './models/notification.model'
import { InstitutionNotificationService } from './institutionNotification.service'
import { InternalNotificationController } from './internalNotification.controller'
import { InternalNotificationService } from './internalNotification.service'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'
import { NotificationDispatchService } from './notificationDispatch.service'
import { SubpoenaNotificationService } from './subpoenaNotification.service'

@Module({
  imports: [
    EmailModule,
    SmsModule,
    CmsTranslationsModule,
    MessageModule,
    InstitutionModule,
    UserModule,
    forwardRef(() => SubpoenaModule),
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    forwardRef(() => EventModule),
    forwardRef(() => DefendantModule),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController, InternalNotificationController],
  providers: [
    NotificationService,
    InternalNotificationService,
    NotificationDispatchService,
    InstitutionNotificationService,
    SubpoenaNotificationService,
  ],
})
export class NotificationModule {}
