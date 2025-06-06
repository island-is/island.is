import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { InvoicePaymentController } from './invoicePayment.controller'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import {
  PaymentFlow,
  PaymentFlowCharge,
} from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowEvent } from '../paymentFlow/models/paymentFlowEvent.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFlowFjsChargeConfirmation } from '../paymentFlow/models/paymentFlowFjsChargeConfirmation.model'
import { PaymentFlowPaymentConfirmation } from '../paymentFlow/models/paymentFlowPaymentConfirmation.model'
import { JwksModule } from '../jwks/jwks.module'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'

@Module({
  imports: [
    SequelizeModule.forFeature([
      PaymentFlow,
      PaymentFlowCharge,
      PaymentFlowEvent,
      PaymentFlowFjsChargeConfirmation,
      PaymentFlowPaymentConfirmation,
    ]),
    ConfigModule.forRoot({
      load: [PaymentFlowModuleConfig, JwksConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    NationalRegistryV3ClientModule,
    CompanyRegistryClientModule,
    JwksModule,
  ],
  controllers: [InvoicePaymentController],
  providers: [PaymentFlowService],
})
export class InvoicePaymentModule {}
