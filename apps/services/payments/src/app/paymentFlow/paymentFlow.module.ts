import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { PaymentFlowController } from './paymentFlow.controller'
import { PaymentFlowService } from './paymentFlow.service'
import { PaymentFlow, PaymentFlowCharge } from './models/paymentFlow.model'
import { CompanyRegistryClientModule } from '@island.is/clients/rsk/company-registry'
import { NationalRegistryV3ClientModule } from '@island.is/clients/national-registry-v3'
import { PaymentFlowEvent } from './models/paymentFlowEvent.model'
import { PaymentFlowFjsChargeConfirmation } from './models/paymentFlowFjsChargeConfirmation.model'
import { PaymentFlowPaymentConfirmation } from './models/paymentFlowPaymentConfirmation.model'
import { JwksModule } from '../jwks/jwks.module'
import { ConfigModule } from '@nestjs/config'
import { PaymentFlowModuleConfig } from './paymentFlow.config'
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
  controllers: [PaymentFlowController],
  providers: [PaymentFlowService],
  exports: [PaymentFlowService],
})
export class PaymentFlowModule {}
