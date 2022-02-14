import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { DeductionFactorsModel } from './models'
import { DeductionFactorsService } from './deductionFactors.service'

@Module({
  imports: [SequelizeModule.forFeature([DeductionFactorsModel])],
  providers: [DeductionFactorsService],
  exports: [DeductionFactorsService],
})
export class DeductionFactorsModule {}
