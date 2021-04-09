import { Module } from '@nestjs/common'

import { AuditModule } from '../audit'
import { FileController } from './file.controller'
import { FileResolver } from './file.resolver'

@Module({
  imports: [AuditModule],
  controllers: [FileController],
  providers: [FileResolver],
})
export class FileModule {}
