import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { InvoicePaymentController } from './invoicePayment.controller'
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
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { InvoicePaymentService } from './invoicePayment.service'
import { JwksModule } from '../jwks/jwks.module'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'
import { InvoicePaymentModuleConfig } from './invoicePayment.config'
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
      load: [PaymentFlowModuleConfig, JwksConfig, InvoicePaymentModuleConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    DebtPaymentModule,
    JwksModule,
  ],
  controllers: [InvoicePaymentController],
  providers: [InvoicePaymentService, PaymentFlowService],
})
export class InvoicePaymentModule {}
