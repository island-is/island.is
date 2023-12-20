import { Module } from '@nestjs/common'
import { FinanceClientV2Service } from './financeV2.service'
import { FinanceClientV2Provider } from './financeV2.provider'

@Module({
  providers: [FinanceClientV2Service, FinanceClientV2Provider],
  exports: [FinanceClientV2Service],
})
export class FinanceClientV2Module {}
