import { Module } from '@nestjs/common'
import { ApplicationsNotificationsModule } from '@island.is/application/template-api-modules'
import { UserNotificationService } from './user-notification.service'

@Module({
  imports: [ApplicationsNotificationsModule],
  providers: [UserNotificationService],
  exports: [UserNotificationService],
})
export class UserNotificationModule {}
