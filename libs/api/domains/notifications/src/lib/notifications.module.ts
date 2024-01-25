import { AuthModule } from '@island.is/auth-nest-tools'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { UserNotificationClientModule } from '@island.is/clients/user-notification'

import { Module } from '@nestjs/common'

import { NotificationsResolver } from './notifications.resolver'
import { NotificationsService } from './notifications.service'

@Module({
  imports: [AuthModule, FeatureFlagModule, UserNotificationClientModule],
  providers: [
    NotificationsResolver,
    NotificationsService,
    {
      provide: LOGGER_PROVIDER,
      useValue: logger,
    },
  ],
  exports: [],
})
export class NotificationsModule {}
