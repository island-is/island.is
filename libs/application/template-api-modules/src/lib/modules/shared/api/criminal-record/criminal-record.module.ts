import { DynamicModule } from '@nestjs/common'

import { CriminalRecordProviderService } from './criminal-record.service'
import { CriminalRecordModule } from '@island.is/api/domains/criminal-record'
import { BaseTemplateAPIModuleConfig } from '../../../../types'

export class CriminalRecordProviderModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: CriminalRecordModule,
      imports: [CriminalRecordModule.register(config.criminalRecord)],
      providers: [CriminalRecordProviderService],
      exports: [CriminalRecordProviderService],
    }
  }
}
