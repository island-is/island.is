import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { FinanceClientV3Module } from '@island.is/clients/finance-v3'
import { LoggingModule } from '@island.is/logging'

import { FjsDebtPayment, PaymentFlowEvent } from '../paymentFlow/models'
import { DebtFjsService } from './debtFjs.service'
import { DebtSettlementService } from './debtSettlement.service'

@Module({
  imports: [
    FinanceClientV3Module,
    LoggingModule,
    SequelizeModule.forFeature([FjsDebtPayment, PaymentFlowEvent]),
  ],
  providers: [DebtFjsService, DebtSettlementService],
  exports: [DebtFjsService, DebtSettlementService],
})
export class DebtPaymentModule {}
