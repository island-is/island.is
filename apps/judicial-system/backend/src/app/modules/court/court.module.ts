import { Module } from '@nestjs/common'

import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { CourtService } from './court.service'

@Module({
  imports: [CourtClientModule],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
