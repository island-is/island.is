import { Module } from '@nestjs/common'
import { OfficialJournalOfIcelandApplicationClientService } from './ojoiApplicationClient.service'
import { OfficialJournalOfIcelandApplicationClientApiProvider } from './ojoiApplicationClient.provider'

@Module({
  providers: [
    OfficialJournalOfIcelandApplicationClientApiProvider,
    OfficialJournalOfIcelandApplicationClientService,
  ],
  exports: [OfficialJournalOfIcelandApplicationClientService],
})
export class OfficialJournalOfIcelandApplicationClientModule {}
