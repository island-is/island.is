import { Module } from '@nestjs/common'

import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { CardPaymentController } from './cardPayment.controller'
import { CardPaymentService } from './cardPayment.service'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import {
  PaymentFlow,
  PaymentFlowCharge,
} from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowEvent } from '../paymentFlow/models/paymentFlowEvent.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFlowFjsChargeConfirmation } from '../paymentFlow/models/paymentFlowFjsChargeConfirmation.model'
import { ConfigModule } from '@nestjs/config'
import { CardPaymentModuleConfig } from './cardPayment.config'
import { CardPaymentCacheModule } from './cardPayment.cache'
import { PaymentFlowPaymentConfirmation } from '../paymentFlow/models/paymentFlowPaymentConfirmation.model'

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
      isGlobal: true,
      load: [CardPaymentModuleConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    NationalRegistryV3ClientModule,
    CompanyRegistryClientModule,
    CardPaymentCacheModule,
  ],
  controllers: [CardPaymentController],
  providers: [CardPaymentService, PaymentFlowService],
})
export class CardPaymentModule {}
