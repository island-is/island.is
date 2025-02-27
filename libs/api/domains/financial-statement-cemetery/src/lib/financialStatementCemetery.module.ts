import { Module } from '@nestjs/common'
import { ConfigModule } from '@island.is/nest/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { FinancialStatementCemeteryResolver } from './financialStatementCemetery.resolver'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
    FinancialStatementsInaoClientModule,
  ],
  providers: [FinancialStatementCemeteryResolver],
  exports: [],
})
export class ApiDomainsFinancialStatementCemeteryModule {}
