import { UserNotificationClientModule } from '@island.is/clients/user-notification'

import { Module } from '@nestjs/common'

import { NotificationsResolver } from './notifications.resolver'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [UserNotificationClientModule],
  providers: [NotificationsResolver, NotificationsService],
  exports: [],
})
export class NotificationsModule {}
