import { forwardRef, Module } from '@nestjs/common'

import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { EventModule } from '../index'
import { CourtService } from './court.service'

@Module({
  imports: [CourtClientModule, forwardRef(() => EventModule)],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
