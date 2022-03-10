import { Module } from '@nestjs/common'
import { FinanceClientModule } from '@island.is/clients/finance'
import { FinanceResolver } from './api-domains-finance.resolver'

@Module({
  imports: [FinanceClientModule],
  providers: [FinanceResolver],
})
export class FinanceModule {}
