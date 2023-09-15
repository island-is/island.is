import { Module } from '@nestjs/common'
import { FileUploadResolver } from './file-upload.resolver'
import { FileStorageModule } from '@island.is/file-storage'

@Module({
  imports: [FileStorageModule],
  providers: [FileUploadResolver],
})
export class FileUploadModule {}
