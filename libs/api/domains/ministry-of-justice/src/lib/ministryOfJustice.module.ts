import { Module } from '@nestjs/common'
import { MinistryOfJusticeResolver } from './ministryOfJustice.resolver'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import { OfficialJournalClientModule } from '@island.is/clients/official-journal-public'

@Module({
  imports: [OfficialJournalClientModule],
  providers: [MinistryOfJusticeResolver, MinistryOfJusticeService],
  exports: [MinistryOfJusticeService],
})
export class MinistryOfJusticeModule {}
