import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { SharedTemplateAPIModule } from '../../shared'
import { ConfigModule } from '@nestjs/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { FinancialStatementPoliticalPartyTemplateService } from './financial-statement-political-party.service'

export class FinancialStatementPoliticalPartyTemplateModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: FinancialStatementPoliticalPartyTemplateModule,
      imports: [
        SharedTemplateAPIModule.register(config),
        ConfigModule.forRoot({
          load: [FinancialStatementsInaoClientConfig],
        }),
        FinancialStatementsInaoClientModule,
      ],
      providers: [FinancialStatementPoliticalPartyTemplateService],
      exports: [FinancialStatementPoliticalPartyTemplateService],
    }
  }
}
