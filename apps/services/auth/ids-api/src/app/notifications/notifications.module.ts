import { Module } from '@nestjs/common'

import { SmsModule } from '@island.is/nova-sms'

import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [SmsModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
