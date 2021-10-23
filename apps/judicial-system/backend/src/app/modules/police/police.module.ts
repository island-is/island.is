import { Module } from '@nestjs/common'

import { CaseModule } from '../case'
import { PoliceService } from './police.service'
import { PoliceController } from './police.controller'

@Module({
  imports: [CaseModule],
  providers: [PoliceService],
  exports: [PoliceService],
  controllers: [PoliceController],
})
export class PoliceModule {}
