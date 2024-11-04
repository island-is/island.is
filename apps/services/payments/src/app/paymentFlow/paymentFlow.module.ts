import { Module } from '@nestjs/common'

import { SequelizeModule } from '@nestjs/sequelize'

import { PaymentFlowController } from './paymentFlow.controller'
import { PaymentFlowService } from './paymentFlow.service'
import { PaymentFlow } from './models/paymentFlow.model'

@Module({
  imports: [SequelizeModule.forFeature([PaymentFlow])],
  controllers: [PaymentFlowController],
  providers: [PaymentFlowService],
})
export class PaymentFlowModule {}
