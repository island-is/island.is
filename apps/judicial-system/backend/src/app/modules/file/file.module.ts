import { Module } from '@nestjs/common'

import { CaseModule } from '../case'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { AwsS3Service } from './awsS3.service'

@Module({
  imports: [CaseModule],
  controllers: [FileController],
  providers: [FileService, AwsS3Service],
})
export class FileModule {}
