import { forwardRef, Module } from '@nestjs/common'

import { EmailModule } from '@island.is/email-service'

import { CourtClientModule } from '@island.is/judicial-system/court-client'

import { EventModule, RepositoryModule } from '..'
import { CourtService } from './court.service'

@Module({
  imports: [
    forwardRef(() => RepositoryModule),
    CourtClientModule,
    EmailModule,
    forwardRef(() => EventModule),
  ],
  providers: [CourtService],
  exports: [CourtService],
})
export class CourtModule {}
