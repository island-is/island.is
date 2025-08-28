import { Module } from '@nestjs/common'

import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { CardPaymentController } from './cardPayment.controller'
import { CardPaymentService } from './cardPayment.service'
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
import { JwksModule } from '../jwks/jwks.module'
import { JwksConfig } from '../jwks/jwks.config'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'

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
      load: [CardPaymentModuleConfig, PaymentFlowModuleConfig, JwksConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    CardPaymentCacheModule,
    JwksModule,
  ],
  controllers: [CardPaymentController],
  providers: [CardPaymentService, PaymentFlowService],
})
export class CardPaymentModule {}
