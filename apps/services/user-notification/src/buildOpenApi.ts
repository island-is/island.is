import { CacheModule, Module } from '@nestjs/common'
import { buildOpenApi } from '@island.is/infra-nest-server'
import { QueueModule } from '@island.is/message-queue'
import { openApi } from './openApi'
import { NotificationsController } from './app/modules/notifications/notifications.controller'
import { AppModule } from './app/app.module'

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 100,
    }),
    QueueModule.register({
      client: {},
      queue: {
        name: 'notifications',
        queueName: '',
      },
    }),
  ],
  controllers: [NotificationsController],
})
class BuildModule {}

buildOpenApi({
  path: 'apps/services/user-notification/src/openapi.yaml',
  appModule: AppModule,
  openApi,
})
