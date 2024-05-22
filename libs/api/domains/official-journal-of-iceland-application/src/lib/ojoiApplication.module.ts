import { Module } from '@nestjs/common'
import { OfficialJournalOfIcelandApplicationClientModule } from '@island.is/clients/official-journal-of-iceland/application'
import { OfficialJournalOfIcelandApplicationService } from './ojoiApplication.service'
import { OfficialJournalOfIcelandApplicationResolver } from './ojoiApplication.resolver'

@Module({
  imports: [OfficialJournalOfIcelandApplicationClientModule],
  providers: [
    OfficialJournalOfIcelandApplicationService,
    OfficialJournalOfIcelandApplicationResolver,
  ],
  exports: [OfficialJournalOfIcelandApplicationService],
})
export class OfficialJournalOfIcelandApplicationModule {}
