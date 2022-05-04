import { Module } from '@nestjs/common'

import { FileController } from './file.controller'
import { RestrictedFileController } from './restrictedFile.controller'
import { FileResolver } from './file.resolver'
import { FileService } from './file.service'

@Module({
  controllers: [FileController, RestrictedFileController],
  providers: [FileResolver, FileService],
})
export class FileModule {}
