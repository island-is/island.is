import { Module } from '@nestjs/common'

import { FileController } from './file.controller'
import { FileResolver } from './file.resolver'

@Module({
  controllers: [FileController],
  providers: [FileResolver],
})
export class FileModule {}
