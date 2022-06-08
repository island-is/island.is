import {
  FinancialStatementsInaoModule,
  FinancialStatementsInaoService,
} from '@island.is/api/domains/financial-statements-inao'
import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'

export class FinancialStatementsInaoTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialStatementsInaoTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        FinancialStatementsInaoModule,
      ],
      providers: [FinancialStatementsInaoService],
      exports: [FinancialStatementsInaoService],
    }
  }
}
