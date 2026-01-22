import { createRedisCluster } from '@island.is/cache'
import { FileStorageConfig, FileStorageModule } from '@island.is/file-storage'
import { LoggingModule } from '@island.is/logging'
import { AwsModule } from '@island.is/nest/aws'
import { BullModule as NestBullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Value } from '../applications/models/value.model'
import { FileConfig } from './file.config'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { UploadProcessor } from './upload.processor'

@Module({
  imports: [
    AwsModule,
    LoggingModule,
    ConfigModule.forFeature(FileStorageConfig),
    FileStorageModule,
    SequelizeModule.forFeature([Value]),
    ConfigModule.forFeature(FileConfig),
    NestBullModule.registerQueueAsync({
      name: 'upload',
      imports: [ConfigModule.forFeature(FileConfig)],
      useFactory: (config: ConfigType<typeof FileConfig>) => ({
        prefix: `{${config.bullModuleName ?? 'form_system_api_bull_module'}}`,
        createClient: () =>
          createRedisCluster({
            name: config.bullModuleName ?? 'form_system_api_bull_module',
            ssl: config.redis.ssl,
            nodes: config.redis.nodes,
            noPrefix: true,
          }),
      }),
      inject: [FileConfig.KEY, FileStorageConfig.KEY],
    }),
  ],
  controllers: [FileController],
  providers: [FileService, UploadProcessor],
  exports: [FileService],
})
export class FileModule {}
