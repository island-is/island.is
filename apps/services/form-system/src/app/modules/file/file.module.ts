import { FileStorageConfig } from '@island.is/file-storage'
import { LoggingModule } from '@island.is/logging'
import { AwsModule } from '@island.is/nest/aws'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Value } from '../applications/models/value.model'
import { FileConfig } from './file.config'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { FileStorageWrapperModule } from './fileStorageWrapper'

@Module({
  imports: [
    AwsModule,
    LoggingModule,
    ConfigModule.forFeature(FileStorageConfig),
    FileStorageWrapperModule,
    SequelizeModule.forFeature([Value]),
    ConfigModule.forFeature(FileConfig),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
