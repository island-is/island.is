import { Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [NotificationsModule],
})
export class AppModule {}
