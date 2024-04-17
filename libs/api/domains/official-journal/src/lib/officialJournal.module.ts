import { Module } from '@nestjs/common'
import { OfficialJournalResolver } from './officialJournal.resolver'
import { OfficialJournalService } from './officialJournal.service'
import { OfficialJournalClientModule } from '@island.is/clients/official-journal'

@Module({
  imports: [OfficialJournalClientModule],
  providers: [OfficialJournalResolver, OfficialJournalService],
  exports: [OfficialJournalService],
})
export class OfficialJournalModule {}
