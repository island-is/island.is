import { SequelizeConfigService } from '@island.is/application/api/core'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { PaymentService } from './payment.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Payment]),
  ],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class ApplicationApiPaymentModule {}
