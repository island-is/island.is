import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module, CaseModule, EventModule, SubpoenaModule } from '..'
import { PoliceController } from './police.controller'
import { PoliceService } from './police.service'

@Module({
  imports: [
    forwardRef(() => CaseModule),
    forwardRef(() => EventModule),
    forwardRef(() => AwsS3Module),
    forwardRef(() => SubpoenaModule),
  ],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
