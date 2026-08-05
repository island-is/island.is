import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { InvoicePaymentController } from './invoicePayment.controller'
import {
  PaymentFlow,
  PaymentFlowCharge,
} from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowEvent } from '../paymentFlow/models/paymentFlowEvent.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { InvoicePaymentService } from './invoicePayment.service'
import { FjsCharge } from '../paymentFlow/models/fjsCharge.model'
import { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import { JwksModule } from '../jwks/jwks.module'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'
import { InvoicePaymentModuleConfig } from './invoicePayment.config'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentWorkerEvent } from '../paymentFlow/models/paymentWorkerEvent.model'

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
    ]),
    ConfigModule.forRoot({
      load: [PaymentFlowModuleConfig, JwksConfig, InvoicePaymentModuleConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    JwksModule,
  ],
  controllers: [InvoicePaymentController],
  providers: [InvoicePaymentService, PaymentFlowService],
})
export class InvoicePaymentModule {}
