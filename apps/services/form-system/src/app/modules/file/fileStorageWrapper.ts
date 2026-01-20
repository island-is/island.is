import { FileStorageConfig, FileStorageService } from '@island.is/file-storage'
import { AwsModule } from '@island.is/nest/aws'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [AwsModule, ConfigModule.forFeature(FileStorageConfig)],
  providers: [
    {
      provide: 'CONFIGURATION(FileStorageModule)',
      useValue: {
        tempBucket:
          process.env.FILE_STORAGE_UPLOAD_BUCKET ?? 'island-is-dev-upload-api',
        region: process.env.AWS_REGION ?? 'eu-west-1',
      },
    },
    FileStorageService,
  ],
  exports: [FileStorageService],
})
export class FileStorageWrapperModule {}
