import { forwardRef, Module } from '@nestjs/common'

import { AwsS3Module, CaseModule, EventModule, SubpoenaModule } from '../index'
import { InternalPoliceController } from './internalPolice.controller'
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
  controllers: [PoliceController, InternalPoliceController],
})
export class PoliceModule {}
