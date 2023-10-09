import { DynamicModule, Module } from '@nestjs/common'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { createRedisCluster } from '@island.is/cache'
import { SigningModule } from '@island.is/dokobit-signing'
import { LoggingModule } from '@island.is/logging'
import { AwsModule } from '@island.is/nest/aws'
import { FileService } from './file.service'

import { ApplicationFilesConfig } from './files.config'
import { ConfigType } from '@nestjs/config'
import { UploadProcessor } from './upload.processor'
import { FileStorageModule } from '@island.is/file-storage'
import { ApplicationApiCoreModule } from '@island.is/application/api/core'
let BullModule: DynamicModule

if (process.env.INIT_SCHEMA === 'true') {
  BullModule = NestBullModule.registerQueueAsync()
} else {
  const bullModuleName = 'application_system_api_bull_module'
  BullModule = NestBullModule.registerQueueAsync({
    name: 'upload',
    useFactory: (config: ConfigType<typeof ApplicationFilesConfig>) => ({
      prefix: `{${bullModuleName}}`,
      createClient: () =>
        createRedisCluster({
          name: bullModuleName,
          ssl: config.redis.ssl,
          nodes: config.redis.nodes,
          noPrefix: true,
        }),
    }),
    inject: [ApplicationFilesConfig.KEY],
  })
}

@Module({
  imports: [
    ApplicationApiCoreModule,
    AwsModule,
    SigningModule,
    LoggingModule,
    BullModule,
    FileStorageModule,
  ],
  providers: [FileService, UploadProcessor],
  exports: [FileService, BullModule],
})
export class ApplicationFilesModule {}
