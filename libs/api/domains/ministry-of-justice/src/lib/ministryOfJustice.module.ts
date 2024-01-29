import { Module } from '@nestjs/common'
import { MinistryOfJusticeResolver } from './ministryOfJustice.resolver'
import { MinistryOfJusticeService } from './ministryOfJustice.service'

@Module({
  providers: [MinistryOfJusticeResolver, MinistryOfJusticeService],
  exports: [MinistryOfJusticeService],
})
export class MinistryOfJusticeModule {}
