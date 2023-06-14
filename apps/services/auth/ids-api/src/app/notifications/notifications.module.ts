import { Module } from '@nestjs/common'

import { SmsModule } from '@island.is/nova-sms'

import environment from '../../environments/environment'
import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [SmsModule.register(environment.smsOptions)],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
