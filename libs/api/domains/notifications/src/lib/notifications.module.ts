import { UserNotificationClientModule } from '@island.is/clients/user-notification'
import { UserProfileClientModule } from '@island.is/clients/user-profile'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { Module } from '@nestjs/common'

import { NotificationsResolver } from './notifications.resolver'
import {
  NotificationsListResolver,
  NotificationSenderResolver,
} from './notificationsList.resolver'
import { NotificationsService } from './notifications.service'
import { NotificationsAdminResolver } from './notificationsAdmin.resolver'
import { NotificationsAdminService } from './notificationsAdmin.service'
import { NotificationSettingsResolver } from './notificationSettings.resolver'
import { NotificationSettingsService } from './notificationSettings.service'

@Module({
  imports: [
    UserNotificationClientModule,
    UserProfileClientModule,
    FeatureFlagModule,
  ],
  providers: [
    NotificationsResolver,
    NotificationsListResolver,
    NotificationSenderResolver,
    NotificationsAdminResolver,
    NotificationsService,
    NotificationsAdminService,
    NotificationSettingsResolver,
    NotificationSettingsService,
  ],
  exports: [],
})
export class NotificationsModule {}
