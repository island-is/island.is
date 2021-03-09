import { DynamicModule } from '@nestjs/common'
import { FileStorageService } from './file-storage.service'
import {
  FileStorageConfig,
  FILE_STORAGE_CONFIG,
} from './config/fileStorageConfig'

export class FileStorageModule {
  static register(config: FileStorageConfig): DynamicModule {
    return {
      module: FileStorageModule,
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
