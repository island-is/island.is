import { Module } from '@nestjs/common'
import { OfficialJournalOfIcelandResolver } from './officialJournalOfIceland.resolver'
import { OfficialJournalOfIcelandService } from './officialJournalOfIceland.service'
import { OfficialJournalOfIcelandClientModule } from '@island.is/clients/official-journal-of-iceland'

@Module({
  imports: [OfficialJournalOfIcelandClientModule],
  providers: [
    OfficialJournalOfIcelandResolver,
    OfficialJournalOfIcelandService,
  ],
  exports: [OfficialJournalOfIcelandService],
})
export class OfficialJournalOfIcelandModule {}
