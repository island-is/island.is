import { Module } from '@nestjs/common'

import { UserNotificationClientModule } from '@island.is/clients/user-notification'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [UserNotificationClientModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class ApplicationsNotificationsModule {}
