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
import { FjsCharge } from '../paymentFlow/models/fjsCharge.model'
import { ConfigModule } from '@nestjs/config'
import { CardPaymentModuleConfig } from './cardPayment.config'
import { CardPaymentCacheModule } from './cardPayment.cache'
import { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import { JwksModule } from '../jwks/jwks.module'
import { JwksConfig } from '../jwks/jwks.config'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
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
