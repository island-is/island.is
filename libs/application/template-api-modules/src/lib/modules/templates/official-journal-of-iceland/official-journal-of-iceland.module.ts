import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { OfficialJournalOfIcelandTemaplateService } from './official-journal-of-iceland.service'
import { OfficialJournalOfIcelandModule } from '@island.is/api/domains/official-journal-of-iceland'
import { OfficialJournalOfIcelandApplicationModule } from '@island.is/api/domains/official-journal-of-iceland-application'

export class OfficialJournalOfIcelandTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OfficialJournalOfIcelandTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        OfficialJournalOfIcelandModule,
        OfficialJournalOfIcelandApplicationModule,
      ],
      providers: [OfficialJournalOfIcelandTemaplateService],
      exports: [OfficialJournalOfIcelandTemaplateService],
    }
  }
}
