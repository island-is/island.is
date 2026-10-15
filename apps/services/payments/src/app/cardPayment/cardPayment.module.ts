import { Module } from '@nestjs/common'

import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { CardPaymentController } from './cardPayment.controller'
import { CardPaymentService } from './cardPayment.service'
import {
  PaymentFlow,
  PaymentFlowCharge,
  PaymentFlowEvent,
  FjsCharge,
  CardPaymentDetails,
  PaymentFulfillment,
  PaymentWorkerEvent,
  PaymentFlowDebt,
  FjsDebtPayment,
} from '../paymentFlow/models'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { ConfigModule } from '@nestjs/config'
import { CardPaymentModuleConfig } from './cardPayment.config'
import { CardPaymentCacheModule } from './cardPayment.cache'
import { JwksModule } from '../jwks/jwks.module'
import { JwksConfig } from '../jwks/jwks.config'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { RefundModule } from '../refund/refund.module'
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
      FjsDebtPayment,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [CardPaymentModuleConfig, PaymentFlowModuleConfig, JwksConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    DebtPaymentModule,
    CardPaymentCacheModule,
    JwksModule,
    RefundModule,
  ],
  controllers: [CardPaymentController],
  providers: [CardPaymentService, PaymentFlowService],
})
export class CardPaymentModule {}
