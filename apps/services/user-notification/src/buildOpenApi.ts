import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { buildOpenApi } from '@island.is/infra-nest-server'
import { QueueModule } from '@island.is/message-queue'
import { openApi } from './openApi'
import { NotificationsController } from './app/modules/notifications/notifications.controller'
import { NotificationsService } from './app/modules/notifications/notifications.service'
import { AppModule } from './app/app.module'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './app/sequelizeConfig.service'
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
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
  ],
  // controllers: [NotificationsController],
  // providers: [NotificationsService],
})
class BuildModule {}

buildOpenApi({
  path: 'apps/services/user-notification/src/openapi.yaml',
  appModule: BuildModule, //BUILD_MODULE, TODO ADD A NOTE ABOUT THIS APPMODULE BUILDMODULE SETUP
  openApi,
})
