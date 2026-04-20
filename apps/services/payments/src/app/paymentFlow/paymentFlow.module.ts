import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { PaymentFlowController } from './paymentFlow.controller'
import { PaymentFlowService } from './paymentFlow.service'
import { PaymentFlow, PaymentFlowCharge } from './models/paymentFlow.model'
import { PaymentFlowEvent } from './models/paymentFlowEvent.model'
import { FjsCharge } from './models/fjsCharge.model'
import { CardPaymentDetails } from './models/cardPaymentDetails.model'
import { JwksModule } from '../jwks/jwks.module'
import { ConfigModule } from '@nestjs/config'
import { PaymentFlowModuleConfig } from './paymentFlow.config'
import { JwksConfig } from '../jwks/jwks.config'
import { PaymentFulfillment } from './models/paymentFulfillment.model'
import { PaymentWorkerEvent } from './models/paymentWorkerEvent.model'

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
      load: [PaymentFlowModuleConfig, JwksConfig],
    }),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
    JwksModule,
  ],
  controllers: [PaymentFlowController],
  providers: [PaymentFlowService],
  exports: [PaymentFlowService, SequelizeModule],
})
export class PaymentFlowModule {}
