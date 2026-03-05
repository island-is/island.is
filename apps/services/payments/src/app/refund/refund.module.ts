import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import {
  PaymentFlow,
  PaymentFlowCharge,
} from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowEvent } from '../paymentFlow/models/paymentFlowEvent.model'
import { FjsCharge } from '../paymentFlow/models/fjsCharge.model'
import { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentWorkerEvent } from '../paymentFlow/models/paymentWorkerEvent.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { PaymentFlowModuleConfig } from '../paymentFlow/paymentFlow.config'
import { JwksModule } from '../jwks/jwks.module'
import { JwksConfig } from '../jwks/jwks.config'
import { RefundController } from './refund.controller'
import { RefundService } from './refund.service'
import { RefundModuleConfig } from './refund.config'

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
      load: [RefundModuleConfig, PaymentFlowModuleConfig, JwksConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    JwksModule,
  ],
  controllers: [RefundController],
  providers: [RefundService, PaymentFlowService],
  exports: [RefundService],
})
export class RefundModule {}
