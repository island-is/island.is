import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AmountModel } from './models'
import { AmountService } from './amount.service'
import { DeductionFactorsModule } from '../deductionFactors'

@Module({
  imports: [SequelizeModule.forFeature([AmountModel]), DeductionFactorsModule],
  providers: [AmountService],
  exports: [AmountService],
})
export class AmountModule {}
