import { Module } from '@nestjs/common'
import { FinanceClientV3Module } from '@island.is/clients/finance-v3'

import { SharedTemplateAPIModule } from '../../shared'

import { PayDebtsService } from './pay-debts.service'
@Module({
  imports: [FinanceClientV3Module, SharedTemplateAPIModule],
  providers: [PayDebtsService],
  exports: [PayDebtsService],
})
export class PayDebtsModule {}
