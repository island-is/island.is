import { Module } from '@nestjs/common'

import { FinanceClientV3Module } from '@island.is/clients/finance-v3'
import { LoggingModule } from '@island.is/logging'

import { DebtFjsService } from './debtFjs.service'

@Module({
  imports: [FinanceClientV3Module, LoggingModule],
  providers: [DebtFjsService],
  exports: [DebtFjsService],
})
export class DebtPaymentModule {}
