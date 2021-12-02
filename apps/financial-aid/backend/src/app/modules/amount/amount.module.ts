import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AmountModel } from './models'
import { AmountService } from './amount.service'
import { AmountController } from './amount.controller'
import { DeductionFactorsModule } from '../deductionFactors'

@Module({
  imports: [SequelizeModule.forFeature([AmountModel]), DeductionFactorsModule],
  providers: [AmountService],
  controllers: [AmountController],
  exports: [AmountService],
})
export class AmountModule {}
