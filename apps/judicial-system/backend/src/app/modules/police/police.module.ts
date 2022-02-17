import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module } from '../index'
import { CaseModule } from '../case'
import { PoliceService } from './police.service'
import { PoliceController } from './police.controller'

@Module({
  imports: [forwardRef(() => CaseModule), forwardRef(() => AwsS3Module)],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
