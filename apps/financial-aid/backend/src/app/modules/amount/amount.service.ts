import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { AmountModel } from './models'

import { DeductionFactorsService } from '../deductionFactors'

import { Sequelize } from 'sequelize-typescript'
import { Amount } from '@island.is/financial-aid/shared/lib'

@Injectable()
export class AmountService {
  constructor(
    @InjectModel(AmountModel)
    private readonly amountModel: typeof AmountModel,
    private readonly deductionFactorsService: DeductionFactorsService,
    private sequelize: Sequelize,
  ) {}

  async create(amount: Amount): Promise<AmountModel> {
    return await this.sequelize.transaction(async (t) => {
      return this.amountModel
        .create(amount, { transaction: t })
        .then(async (amountResponse) => {
          await Promise.all(
            amount.deductionFactors.map(async (item) => {
              return await this.deductionFactorsService.create(
                {
                  amountId: amountResponse.id,
                  description: item.description,
                  amount: item.amount,
                },
                t,
              )
            }),
          ).then((deductionFactors) => {
            amountResponse?.setDataValue('deductionFactors', deductionFactors)
          })
          return amountResponse
        })
    })
  }
}
