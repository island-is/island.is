import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { ConfigModule } from '@nestjs/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { FinancialStatementPoliticalPartyTemplateService } from './financial-statement-political-party.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
    FinancialStatementsInaoClientModule,
  ],
  providers: [FinancialStatementPoliticalPartyTemplateService],
  exports: [FinancialStatementPoliticalPartyTemplateService],
})
export class FinancialStatementPoliticalPartyTemplateModule {}
