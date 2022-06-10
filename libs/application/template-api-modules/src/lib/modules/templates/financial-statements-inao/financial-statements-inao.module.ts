import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
  FinancialStatementsInaoClientService,
} from '@island.is/clients/financial-statements-inao'
import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { FinancialStatementsInaoTemplateService } from './financial-statements-inao.service'

export class FinancialStatementsInaoTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialStatementsInaoTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          load: [FinancialStatementsInaoClientConfig],
        }),
        FinancialStatementsInaoClientModule,
      ],
      providers: [FinancialStatementsInaoClientService],
      exports: [FinancialStatementsInaoTemplateService],
    }
  }
}
