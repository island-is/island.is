import { Module } from '@nestjs/common'

import { FileStorageConfig, FileStorageModule } from '@island.is/file-storage'

import { FileUploadResolver } from './file-upload.resolver'

interface FileUploadConfig {
  fileStorage: FileStorageConfig
}

@Module({})
export class FileUploadModule {
  static register(config: FileUploadConfig) {
    return {
      module: FileUploadModule,
      imports: [FileStorageModule.register(config.fileStorage)],
      providers: [FileUploadResolver],
    }
  }
}
