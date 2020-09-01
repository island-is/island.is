import { Module } from '@nestjs/common'
import { FileStorageService } from './file-storage.service'

@Module({
  controllers: [],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
