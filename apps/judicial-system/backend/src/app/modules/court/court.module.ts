import { forwardRef, Module } from '@nestjs/common'

import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { DATE_FACTORY, today } from '../../factories'
import { EventModule } from '../index'
import { CourtService } from './court.service'

@Module({
  imports: [CourtClientModule, forwardRef(() => EventModule)],
  providers: [{ provide: DATE_FACTORY, useFactory: () => today }, CourtService],
  exports: [CourtService],
})
export class CourtModule {}
