import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
  FinancialStatementsInaoClientService,
} from '@island.is/clients/financial-statements-inao'
import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'

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
      exports: [FinancialStatementsInaoClientService],
    }
  }
}
