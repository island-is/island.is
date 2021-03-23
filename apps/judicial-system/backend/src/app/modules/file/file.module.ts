import { Module } from '@nestjs/common'

import { CaseModule } from '../case'
import { FileController } from './file.controller'
import { FileService } from './file.service'

@Module({
  imports: [CaseModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
