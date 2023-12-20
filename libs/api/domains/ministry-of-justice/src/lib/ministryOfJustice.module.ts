import { Module } from '@nestjs/common'
import { MinistryOfJusticeResolver } from './ministryOfJustice.resolver'
import { MinistryOfJusticeService } from './ministryOfJustice.service'

@Module({
  providers: [MinistryOfJusticeResolver, MinistryOfJusticeService],
})
export class MinistryOfJusticeModule {}
