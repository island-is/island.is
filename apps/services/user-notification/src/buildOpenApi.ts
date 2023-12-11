import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { buildOpenApi } from '@island.is/infra-nest-server'
import { QueueModule } from '@island.is/message-queue'
import { openApi } from './openApi'
import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './app/sequelizeConfig.service'
import { AppModule } from './app/app.module'
// @Module({
//   imports: [
//     CacheModule.register({
//       ttl: 60 * 1000,
//       max: 100,
//     }),
//     QueueModule.register({
//       client: {},
//       queue: {
//         name: 'notifications',
//         queueName: '',
//       },
//     }),
//     SequelizeModule.forRootAsync({
//       useClass: SequelizeConfigService,
//     }),
//   ],
// })
// class BuildModule {}

buildOpenApi({
  path: 'apps/services/user-notification/src/openapi.yaml',
  appModule: AppModule, // BuildModule, // local vs CI legacy issue - firebase creds issue ...
  openApi,
})
