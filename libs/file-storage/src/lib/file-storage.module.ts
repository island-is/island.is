import { Module } from '@nestjs/common'

import {
  FILE_STORAGE_CONFIG,
  FileStorageConfig,
} from './file-storage.configuration'
import { FileStorageService } from './file-storage.service'

@Module({})
export class FileStorageModule {
  static register(config: FileStorageConfig) {
    return {
      module: FileStorageModule,
      controllers: [],
      providers: [
        FileStorageService,
        {
          provide: FILE_STORAGE_CONFIG,
          useValue: config,
        },
      ],
      exports: [FileStorageService],
    }
  }
}
