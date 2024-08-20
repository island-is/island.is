import { Module } from '@nestjs/common'
import { OfficialJournalOfIcelandClientService } from './officialJournalOfIcelandClient.service'
import { OfficialJournalOfIcelandClientApiProvider } from './officialJournalOfIcelandClient.provider'

@Module({
  providers: [
    OfficialJournalOfIcelandClientApiProvider,
    OfficialJournalOfIcelandClientService,
  ],
  exports: [OfficialJournalOfIcelandClientService],
})
export class OfficialJournalOfIcelandClientModule {}
