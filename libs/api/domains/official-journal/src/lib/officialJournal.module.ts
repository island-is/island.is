import { Module } from '@nestjs/common'
import { OfficialJournalResolver } from './officialJournal.resolver'
import { OfficialJournalService } from './officialJournal.service'
import { OfficialJournalOfIcelandClientModule } from '@island.is/clients/official-journal-of-iceland'

@Module({
  imports: [OfficialJournalOfIcelandClientModule],
  providers: [OfficialJournalResolver, OfficialJournalService],
  exports: [OfficialJournalService],
})
export class OfficialJournalModule {}
