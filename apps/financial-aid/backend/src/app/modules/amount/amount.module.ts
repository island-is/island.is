import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AmountModel } from './models'
import { AmountService } from './amount.service'
import { DeductionFactorsModule } from '../deductionFactors/deductionFactors.module'
import { AmountController } from './amount.controller'

@Module({
  imports: [SequelizeModule.forFeature([AmountModel]), DeductionFactorsModule],
  providers: [AmountService],
  controllers: [AmountController],
  exports: [AmountService],
})
export class AmountModule {}
