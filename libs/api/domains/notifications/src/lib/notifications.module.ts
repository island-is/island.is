import { UserNotificationClientModule } from '@island.is/clients/user-notification'

import { Module } from '@nestjs/common'

import { NotificationsResolver } from './notifications.resolver'
import {
  NotificationsListResolver,
  NotificationSenderResolver,
} from './notificationsList.resolver'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [UserNotificationClientModule],
  providers: [
    NotificationsResolver,
    NotificationsListResolver,
    NotificationSenderResolver,
    NotificationsService,
  ],
  exports: [],
})
export class NotificationsModule {}
