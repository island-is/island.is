import { CacheModule, Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [NotificationsModule], // isglobal wtf how ... redis?
})
export class AppModule {}
