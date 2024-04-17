import { Module } from '@nestjs/common'
import { NotificationsApiProvider } from './apiConfiguration'
import { DelegationApiUserSystemNotificationConfig } from './user-system-notification.config'

@Module({
  imports: [DelegationApiUserSystemNotificationConfig.registerOptional()],
  providers: [NotificationsApiProvider],
  exports: [NotificationsApiProvider],
})
export class UserSystemNotificationModule {}
