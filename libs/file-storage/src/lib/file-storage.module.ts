import { Module } from '@nestjs/common'
import { FileStorageService } from './file-storage.service'
import { ConfigModule } from '@nestjs/config'
import { fileStorageConfiguration } from './file-storage.configuration'

@Module({
  controllers: [],
  imports: [ConfigModule.forFeature(fileStorageConfiguration)],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
