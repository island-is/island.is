import {
  ApplicationApiCoreModule,
  SequelizeConfigService,
} from '@island.is/application/api/core'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { PaymentService } from './payment.service'
import { PaymentClientModule } from '@island.is/clients/payment'
import { PaymentController } from './payment.controller'
import { PaymentCallbackController } from './payment-callback.controller'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Payment]),
    PaymentClientModule,
    ApplicationApiCoreModule,
  ],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController, PaymentCallbackController],
})
export class PaymentModule {}
