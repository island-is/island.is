import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SmsModule } from '@island.is/nova-sms'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { MessageModule } from '@island.is/judicial-system/message'

import { environment } from '../../../environments'
import { CaseModule, CourtModule, EventModule, DefendantModule } from '../index'
import { Notification } from './models/notification.model'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { InternalNotificationController } from './internalNotification.controller'

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
