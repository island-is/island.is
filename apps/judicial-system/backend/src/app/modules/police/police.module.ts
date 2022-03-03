import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module,CaseModule } from '../index'

import { PoliceController } from './police.controller'
import { PoliceService } from './police.service'

@Module({
  imports: [forwardRef(() => CaseModule), forwardRef(() => AwsS3Module)],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
