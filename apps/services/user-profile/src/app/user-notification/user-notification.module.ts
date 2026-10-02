import { Module } from '@nestjs/common'

import { UserNotificationClient } from './user-notification.client'

@Module({
  providers: [UserNotificationClient],
  exports: [UserNotificationClient],
})
export class UserProfileUserNotificationModule {}
