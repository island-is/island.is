import { CacheModule, Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [
    // CacheModule.register({isGlobal:true}),// redis talk to andes look at others - simple basic cache in memory

    NotificationsModule], // isglobal wtf how ... redis?
})
export class AppModule {}
