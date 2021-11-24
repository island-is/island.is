import { Module } from '@nestjs/common'

import { AwsS3Module } from '../aws-s3'
import { CaseModule } from '../case'
import { PoliceService } from './police.service'
import { PoliceController } from './police.controller'

@Module({
  imports: [AwsS3Module, CaseModule],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
