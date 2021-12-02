import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { AmountModel } from './models'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateAmountDto } from './dto'
import { DeductionFactorsService } from '../deductionFactors'

import { Sequelize } from 'sequelize'

@Injectable()
export class AmountService {
  constructor(
    @InjectModel(AmountModel)
    private readonly amountModel: typeof AmountModel,
    private readonly deductionFactorsService: DeductionFactorsService,
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(amount: CreateAmountDto): Promise<AmountModel> {
    return await this.sequelize.transaction(async (t) => {
      return this.amountModel.create(amount, { transaction: t }).then((res) => {
        amount.deductionFactors.map((item) => {
          return this.deductionFactorsService.create(
            {
              amountId: res.getDataValue('id'),
              description: item.description,
              amount: item.amount,
            },
            t,
          )
        })
        return res
      })
    })
  }
}
