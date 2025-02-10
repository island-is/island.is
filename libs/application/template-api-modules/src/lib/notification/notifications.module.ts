import { Module } from '@nestjs/common'

import { UserNotificationClientModule } from '@island.is/clients/user-notification'
import { NotificationsService } from './notifications.service'
import { LoggingModule } from '@island.is/logging'

@Module({
  imports: [UserNotificationClientModule, LoggingModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class ApplicationsNotificationsModule {}
