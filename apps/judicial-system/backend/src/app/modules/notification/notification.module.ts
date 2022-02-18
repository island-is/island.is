import { forwardRef, Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SmsModule } from '@island.is/nova-sms'
import { EmailModule } from '@island.is/email-service'
import { CmsTranslationsModule } from '@island.is/cms-translations'

import { environment } from '../../../environments'
import { CaseModule, UserModule, CourtModule, EventModule } from '../index'
import { Notification } from './models/notification.model'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'

@Module({
  imports: [
    EmailModule.register(environment.emailOptions),
    SmsModule.register(environment.smsOptions),
    CmsTranslationsModule,
    forwardRef(() => CaseModule),
    forwardRef(() => UserModule),
    forwardRef(() => CourtModule),
    forwardRef(() => EventModule),
    SequelizeModule.forFeature([Notification]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
