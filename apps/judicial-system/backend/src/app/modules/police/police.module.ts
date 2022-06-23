import { forwardRef, Module } from '@nestjs/common'

import { CaseModule, AwsS3Module, EventModule } from '../index'
import { PoliceService } from './police.service'
import { PoliceController } from './police.controller'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => EventModule),
    forwardRef(() => AwsS3Module),
  ],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
