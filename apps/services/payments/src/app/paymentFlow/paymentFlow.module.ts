import { Module } from '@nestjs/common'

import { SequelizeModule } from '@nestjs/sequelize'
import { FeatureFlagModule } from '@island.is/nest/feature-flags'

import { PaymentFlowController } from './paymentFlow.controller'
import { PaymentFlowService } from './paymentFlow.service'
import { PaymentFlow } from './models/paymentFlow.model'

@Module({
  imports: [SequelizeModule.forFeature([PaymentFlow]), FeatureFlagModule],
  controllers: [PaymentFlowController],
  providers: [PaymentFlowService],
})
export class PaymentFlowModule {}
