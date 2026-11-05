import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import {
  PaymentFlow,
  PaymentFlowCharge,
  PaymentFlowEvent,
  FjsCharge,
  CardPaymentDetails,
  PaymentFulfillment,
  PaymentWorkerEvent,
  PaymentFlowDebt,
  DebtSettlement,
} from '../paymentFlow/models'
import { BankTransferPaymentModule } from '../bankTransferPayment/bankTransferPayment.module'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { JwksModule } from '../jwks/jwks.module'
import { JwksConfig } from '../jwks/jwks.config'
import { RefundController } from './refund.controller'
import { RefundService } from './refund.service'
import { RefundOrchestrationService } from './refundOrchestration.service'
import { RefundModuleConfig } from './refund.config'
import { DebtPaymentModule } from '../debtPayment/debtPayment.module'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentFlow,
      PaymentFlowCharge,
      PaymentFlowEvent,
      FjsCharge,
      CardPaymentDetails,
      PaymentFulfillment,
      PaymentWorkerEvent,
      PaymentFlowDebt,
      DebtSettlement,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [RefundModuleConfig, PaymentFlowModuleConfig, JwksConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    DebtPaymentModule,
    JwksModule,
    BankTransferPaymentModule,
  ],
  controllers: [RefundController],
  providers: [RefundService, RefundOrchestrationService, PaymentFlowService],
  exports: [RefundService, RefundOrchestrationService],
})
export class RefundModule {}
