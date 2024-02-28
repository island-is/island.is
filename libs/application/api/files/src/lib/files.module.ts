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

@Module({
  imports: [
    ApplicationApiCoreModule,
    AwsModule,
    SigningModule,
    LoggingModule,
    FileStorageModule,
  ],
  providers: [FileService, UploadProcessor],
  exports: [FileService],
})
export class ApplicationFilesModule {}

export function createBullModule() {
  if (process.env.INIT_SCHEMA === 'true') {
    return NestBullModule.registerQueueAsync()
  } else {
    const bullModuleName = 'application_system_api_bull_module'
    return NestBullModule.registerQueueAsync({
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
}
