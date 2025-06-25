import { Module } from '@nestjs/common'
import { ApplicationsNotificationsModule } from '../../../../notification/notifications.module'
import { UserNotificationService } from './user-notification.service'

@Module({
  imports: [ApplicationsNotificationsModule],
  providers: [UserNotificationService],
  exports: [UserNotificationService],
})
export class UserNotificationModule {}
