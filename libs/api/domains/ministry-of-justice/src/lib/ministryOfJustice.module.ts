import { Module } from '@nestjs/common'
import { MinistryOfJusticeResolver } from './ministryOfJustice.resolver'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import { DmrClientModule } from '@island.is/clients/dmr'

@Module({
  imports: [DmrClientModule],
  providers: [MinistryOfJusticeResolver, MinistryOfJusticeService],
  exports: [MinistryOfJusticeService],
})
export class MinistryOfJusticeModule {}
