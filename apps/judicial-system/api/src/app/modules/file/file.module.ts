import { Module } from '@nestjs/common'

import { FileController } from './file.controller'
import { FileResolver } from './file.resolver'
import { FileService } from './file.service';

@Module({
  controllers: [FileController],
  providers: [FileResolver, FileService],
})
export class FileModule {}
