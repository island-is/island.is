import { Module } from '@nestjs/common'

import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'
import { ChargeFjsV2ClientModule } from '@island.is/clients/charge-fjs-v2'

import { PaymentFlowController } from './paymentFlow.controller'
import { PaymentFlowService } from './paymentFlow.service'
import { PaymentFlow } from './models/paymentFlow.model'

@Module({
  imports: [
    SequelizeModule.forFeature([PaymentFlow]),
    FeatureFlagModule,
    ChargeFjsV2ClientModule,
  ],
  controllers: [PaymentFlowController],
  providers: [PaymentFlowService],
})
export class PaymentFlowModule {}
