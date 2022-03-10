import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, AwsS3Module } from '../index'
import { PoliceService } from './police.service'
import { PoliceController } from './police.controller'

@Module({
  imports: [forwardRef(() => CaseModule), forwardRef(() => AwsS3Module)],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
