import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { ConfigModule } from '@nestjs/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { FinancialStatementCemeteryTemplateService } from './financial-statement-cemetery.service'

export class FinancialStatementCemeteryTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialStatementCemeteryTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          load: [FinancialStatementsInaoClientConfig],
        }),
        FinancialStatementsInaoClientModule,
      ],
      providers: [FinancialStatementCemeteryTemplateService],
      exports: [FinancialStatementCemeteryTemplateService],
    }
  }
}
