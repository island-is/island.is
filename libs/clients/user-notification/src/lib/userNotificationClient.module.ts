import { Module } from '@nestjs/common'
import {
  UserNotificationApiProvider,
  NotificationsApiProvider,
} from './apiConfiguration'

@Module({
  providers: [UserNotificationApiProvider, NotificationsApiProvider],
  exports: [UserNotificationApiProvider, NotificationsApiProvider],
})
export class UserNotificationClientModule {}
