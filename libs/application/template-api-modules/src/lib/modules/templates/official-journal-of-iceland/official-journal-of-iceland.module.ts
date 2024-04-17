import { DynamicModule } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { OfficialJournalOfIcelandService } from './official-journal-of-iceland.service'
import { OfficialJournalModule } from '@island.is/api/domains/official-journal'

export class OfficialJournalOfIcelandModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: OfficialJournalOfIcelandModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        OfficialJournalModule,
      ],
      providers: [OfficialJournalOfIcelandService],
      exports: [OfficialJournalOfIcelandService],
    }
  }
}
