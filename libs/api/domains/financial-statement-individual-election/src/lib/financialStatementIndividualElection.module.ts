import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
  FinancialStatementsInaoClientService,
} from '@island.is/clients/financial-statements-inao'
import { FinancialStatementIndividualElectionResolver } from './financialStatementIndividualElection.resolver'
import { FinancialStatementIndividualElectionService } from './financialStatementIndividualElection.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
    FinancialStatementsInaoClientModule,
  ],
  providers: [
    FinancialStatementIndividualElectionResolver,
    FinancialStatementIndividualElectionService,
    FinancialStatementsInaoClientService,
  ],
  exports: [FinancialStatementIndividualElectionService],
})
export class FinancialStatementIndividualElectionModule {}
