import { Module } from '@nestjs/common'
import { FileUploadResolver } from './file-upload.resolver'
import { FileStorageModule, FileStorageConfig } from '@island.is/file-storage'

@Module({
  imports: [FileStorageModule],
  providers: [FileUploadResolver],
})
export class FileUploadModule {
  static register(config: FileStorageConfig) {
    return {
      module: FileUploadModule,
      providers: [FileUploadResolver],
      imports: [FileStorageModule.register(config)],
    }
  }
}
