import { Module } from '@nestjs/common'

import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { CourtResolver } from './court.resolver'
import { CourtService } from './court.service'

@Module({
  imports: [CourtClientModule],
  providers: [CourtResolver, CourtService],
})
export class CourtModule {}
