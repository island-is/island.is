import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DirectTaxPaymentModel } from './models'
import { DirectTaxPaymentService } from './directTaxPayment.service'

@Module({
  imports: [SequelizeModule.forFeature([DirectTaxPaymentModel])],
  providers: [DirectTaxPaymentService],
  exports: [DirectTaxPaymentService],
})
export class DirectTaxPaymentModule {}
