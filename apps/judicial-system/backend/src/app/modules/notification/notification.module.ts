import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { CmsTranslationsModule } from '@island.is/cms-translations'
import { EmailModule } from '@island.is/email-service'
import { SmsModule } from '@island.is/nova-sms'

import { MessageModule } from '@island.is/judicial-system/message'

import { environment } from '../../../environments'
import { CaseModule, CourtModule, DefendantModule, EventModule } from '../index'
import { Notification } from './models/notification.model'
import { InternalNotificationController } from './internalNotification.controller'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
    CmsTranslationsModule,
    MessageModule,
    forwardRef(() => CaseModule),
    forwardRef(() => CourtModule),
    forwardRef(() => EventModule),
    forwardRef(() => DefendantModule),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController, InternalNotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
