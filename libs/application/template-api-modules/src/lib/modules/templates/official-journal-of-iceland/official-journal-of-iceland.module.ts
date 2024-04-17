import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { OfficialJournalOfIcelandService } from './official-journal-of-iceland.service'
import { OfficialJournalOfIcelandModule } from '@island.is/api/domains/official-journal-of-iceland'

export class OfficialJournalOfIcelandModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OfficialJournalOfIcelandModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        OfficialJournalOfIcelandModule,
      ],
      providers: [OfficialJournalOfIcelandService],
      exports: [OfficialJournalOfIcelandService],
    }
  }
}
