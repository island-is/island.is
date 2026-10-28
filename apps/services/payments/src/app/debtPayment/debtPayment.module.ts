import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { FinanceClientV3Module } from '@island.is/clients/finance-v3'
import { LoggingModule } from '@island.is/logging'

import { DebtSettlement, PaymentFlowEvent } from '../paymentFlow/models'
import { FjsDebtGateway } from './fjsDebt.gateway'
import { DebtSettlementService } from './debtSettlement.service'

@Module({
  imports: [
    FinanceClientV3Module,
    LoggingModule,
    SequelizeModule.forFeature([DebtSettlement, PaymentFlowEvent]),
  ],
  providers: [FjsDebtGateway, DebtSettlementService],
  exports: [DebtSettlementService],
})
export class DebtPaymentModule {}
