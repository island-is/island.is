import { Module } from '@nestjs/common'
import { FinanceClientModule } from '@island.is/clients/finance'
import { FinanceClientV2Module } from '@island.is/clients/finance-v2'
import { FinanceClientV3Module } from '@island.is/clients/finance-v3'
import { FinanceResolver } from './resolvers/api-domains-finance.resolver'
import { FinanceCustomerResolver } from './resolvers/customer.resolver'
import { CustomerService } from './services/customer.service'

@Module({
  imports: [FinanceClientModule, FinanceClientV2Module, FinanceClientV3Module],
  providers: [FinanceResolver, FinanceCustomerResolver, CustomerService],
})
export class FinanceModule {}
