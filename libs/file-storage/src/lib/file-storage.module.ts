import { Module } from '@nestjs/common'
import { FileStorageService } from './file-storage.service'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [AwsModule],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
