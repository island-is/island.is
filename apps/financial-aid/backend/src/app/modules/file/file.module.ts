import { Module } from '@nestjs/common'

import { FileController } from './file.controller'
import { FileService } from './file.service'
import { CloudFrontService } from './cloudFront.service'

@Module({
  controllers: [FileController],
  providers: [FileService, CloudFrontService],
})
export class FileModule {}
