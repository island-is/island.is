import { Module } from '@nestjs/common'

import { UserNotificationClientModule } from '@island.is/clients/user-notification'

@Module({
  imports: [UserNotificationClientModule],
})
export class ApplicationsNotificationsModule {}
