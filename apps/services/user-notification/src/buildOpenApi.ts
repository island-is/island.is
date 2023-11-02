import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { buildOpenApi } from '@island.is/infra-nest-server'
import { QueueModule } from '@island.is/message-queue'
import { openApi } from './openApi'
import { NotificationsController } from './app/modules/notifications/notifications.controller'
import { NotificationsService } from './app/modules/notifications/notifications.service'

@Module({
  imports: [
    CacheModule.register({
      ttl: 60 * 1000,
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
  providers: [NotificationsService],
})
class BuildModule {}

buildOpenApi({
  path: 'apps/services/user-notification/src/openapi.yaml',
  appModule: BuildModule,
  openApi,
})
