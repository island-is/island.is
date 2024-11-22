import { UserNotificationClientModule } from '@island.is/clients/user-notification'

import { Module } from '@nestjs/common'

import { NotificationsResolver } from './notifications.resolver'
import {
  NotificationsListResolver,
  NotificationSenderResolver,
} from './notificationsList.resolver'
import { NotificationsService } from './notifications.service'
import { NotificationsAdminResolver } from './notificationsAdmin.resolver'
import { NotificationsAdminService } from './notificationsAdmin.service'

@Module({
  imports: [UserNotificationClientModule],
  providers: [
    NotificationsResolver,
    NotificationsListResolver,
    NotificationSenderResolver,
    NotificationsAdminResolver,
    NotificationsService,
    NotificationsAdminService,
  ],
  exports: [],
})
export class NotificationsModule {}
