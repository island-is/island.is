import { DynamicModule } from '@nestjs/common'

import { MunicipalitiesFinancialAidClientModule } from '@island.is/clients/municipalities-financial-aid'

import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { FinancialAidService } from './financial-aid.service'

export class FinancialAidModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialAidModule,
      imports: [
        MunicipalitiesFinancialAidClientModule,
        SharedTemplateAPIModule,
      ],
      providers: [FinancialAidService],
      exports: [FinancialAidService],
    }
  }
}
