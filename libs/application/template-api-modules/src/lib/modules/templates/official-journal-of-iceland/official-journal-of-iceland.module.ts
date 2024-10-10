import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { OfficialJournalOfIcelandTemaplateService } from './official-journal-of-iceland.service'
import { OfficialJournalOfIcelandModule } from '@island.is/api/domains/official-journal-of-iceland'
import { OfficialJournalOfIcelandApplicationModule } from '@island.is/api/domains/official-journal-of-iceland-application'

@Module({
  imports: [
    SharedTemplateAPIModule,
    OfficialJournalOfIcelandModule,
    OfficialJournalOfIcelandApplicationModule,
  ],
  providers: [OfficialJournalOfIcelandTemaplateService],
  exports: [OfficialJournalOfIcelandTemaplateService],
})
export class OfficialJournalOfIcelandTemplateModule {}
