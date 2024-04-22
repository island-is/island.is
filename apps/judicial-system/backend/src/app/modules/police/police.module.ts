import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module } from '../aws-s3/awsS3.module'
import { EventModule } from '../event/event.module'
import { CaseModule } from '../index'
import { PoliceController } from './police.controller'
import { PoliceService } from './police.service'

@Module({
  imports: [EventModule, AwsS3Module, forwardRef(() => CaseModule)],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
