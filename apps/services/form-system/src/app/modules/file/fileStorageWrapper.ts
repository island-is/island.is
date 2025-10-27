import { FileStorageService } from '@island.is/file-storage'
import { AwsModule } from '@island.is/nest/aws'
import { Module } from '@nestjs/common'

@Module({
  imports: [AwsModule],
  providers: [
    {
      provide: 'CONFIGURATION(FileStorageModule)',
      useValue: {
        bucket: process.env.FILE_STORAGE_BUCKET ?? 'island-is-dev-upload-api',
        region: process.env.AWS_REGION ?? 'eu-west-1',
      },
    },
    FileStorageService,
  ],
  exports: [FileStorageService],
})
export class FileStorageWrapperModule {}
