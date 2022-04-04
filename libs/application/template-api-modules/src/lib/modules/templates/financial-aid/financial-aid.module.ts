import { DynamicModule } from '@nestjs/common'

import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { FinancialAidService } from './financial-aid.service'

export class FinancialAidModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialAidModule,
      imports: [SharedTemplateAPIModule.register(config)],
      providers: [FinancialAidService],
      exports: [FinancialAidService],
    }
  }
}
