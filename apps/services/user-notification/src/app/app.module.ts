import { CacheModule, Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

@Module({
  imports: [
    // CacheModule.register({
    //   ttl: 5, // seconds
    //   max: 1000, // maximum number of items in cache
    // }),
    NotificationsModule
  ],
 
})
export class AppModule {}









/// WRONG PLACE ?'???????????????????????????'

// import { CacheModule, Module, CacheInterceptor } from '@nestjs/common'
// import { NotificationsController } from './modules/notifications/notifications.controller'
// import { APP_INTERCEPTOR } from '@nestjs/core'
// import { NotificationsModule } from './modules/notifications/notifications.module'

// @Module({
//   imports: [NotificationsModule, CacheModule.register({ isGlobal: true })],
//   controllers: [NotificationsController],
// })
// export class AppModule {}
