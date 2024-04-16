import { Module } from '@nestjs/common'
import { NotificationsApiProvider } from './apiConfiguration'

@Module({
  providers: [NotificationsApiProvider],
  exports: [NotificationsApiProvider],
})
export class UserSystemNotificationModule {}
