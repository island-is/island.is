import { createRedisCluster } from '@island.is/cache'
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
import { FileStorageModule } from '@island.is/file-storage'

@Module({
  imports: [
    AwsModule,
    LoggingModule,
    FileStorageModule,
    SequelizeModule.forFeature([Value]),
    ConfigModule.forFeature(FileConfig),
    NestBullModule.registerQueueAsync({
      name: 'upload',
      imports: [ConfigModule.forFeature(FileConfig)],
      useFactory: (config: ConfigType<typeof FileConfig>) => ({
        prefix: `{${config.bullModuleName ?? 'form-system-upload'}}`,
        createClient: () =>
          createRedisCluster({
            name: config.bullModuleName ?? 'form-system-upload',
            ssl: config.redis.ssl,
            nodes: config.redis.nodes,
            noPrefix: true,
          }),
      }),
      inject: [FileConfig.KEY],
    }),
  ],
  controllers: [FileController],
  providers: [FileService, UploadProcessor],
  exports: [FileService],
})
export class FileModule {}
