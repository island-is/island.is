import { CacheModule, Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [CacheModule.register({ isGlobal: true }), NotificationsModule],
})
export class AppModule {}
