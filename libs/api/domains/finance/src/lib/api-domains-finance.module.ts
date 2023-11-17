import { Module } from '@nestjs/common'
import { FinanceClientModule } from '@island.is/clients/finance'
import { FinanceClientV2Module } from '@island.is/clients/finance-v2'
import { FinanceResolver } from './api-domains-finance.resolver'

@Module({
  imports: [FinanceClientModule, FinanceClientV2Module],
  providers: [FinanceResolver],
})
export class FinanceModule {}
