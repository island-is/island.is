import { UserNotificationClientModule } from '@island.is/clients/user-notification'

import { Module } from '@nestjs/common'

import { NotificationsResolver } from './notifications.resolver'
import { NotificationsListResolver } from './notificationsList.resolver'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [UserNotificationClientModule],
  providers: [
    NotificationsResolver,
    NotificationsListResolver,
    NotificationsService,
  ],
  exports: [],
})
export class NotificationsModule {}
