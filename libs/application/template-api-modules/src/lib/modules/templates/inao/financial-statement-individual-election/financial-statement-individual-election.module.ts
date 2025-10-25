import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { ConfigModule } from '@nestjs/config'
import { FinancialStatementIndividualElectionService } from './financial-statement-individual-election.service'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SharedTemplateAPIModule,
    AwsModule,
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
    FinancialStatementsInaoClientModule,
  ],
  providers: [FinancialStatementIndividualElectionService],
  exports: [FinancialStatementIndividualElectionService],
})
export class FinancialStatementIndividualElectionModule {}
