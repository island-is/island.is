import { Module } from '@nestjs/common'
import { OfficialJournalClientService } from './officialJournalClient.service'
import { OfficialJournalApiProvider } from './officialJournalClient.provider'

@Module({
  providers: [OfficialJournalApiProvider, OfficialJournalClientService],
  exports: [OfficialJournalClientService],
})
export class OfficialJournalClientModule {}
