import { Module } from '@nestjs/common'
import { OfficialJournalOfIcelandApplicationClientModule } from '@island.is/clients/official-journal-of-iceland/application'
import { RegulationsClientModule } from '@island.is/clients/regulations'
import { RegulationsAdminClientModule } from '@island.is/clients/regulations-admin'
import { OfficialJournalOfIcelandApplicationService } from './ojoiApplication.service'
import { OfficialJournalOfIcelandApplicationResolver } from './ojoiApplication.resolver'

@Module({
  imports: [
    OfficialJournalOfIcelandApplicationClientModule,
    RegulationsClientModule,
    RegulationsAdminClientModule,
  ],
  providers: [
    OfficialJournalOfIcelandApplicationService,
    OfficialJournalOfIcelandApplicationResolver,
  ],
  exports: [OfficialJournalOfIcelandApplicationService],
})
export class OfficialJournalOfIcelandApplicationModule {}
