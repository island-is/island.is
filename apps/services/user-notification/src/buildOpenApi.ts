import { Module } from '@nestjs/common'

import { buildOpenApi } from '@island.is/infra-nest-server'
import { QueueModule } from '@island.is/message-queue'

import { NotificationsController } from './app/modules/notifications/notifications.controller'
import { openApi } from './openApi'

@Module({
  imports: [
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
  appModule: BuildModule,
  openApi,
})
