import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { AmountModel } from './models'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateAmountDto } from './dto'
import { DeductionFactorsService } from '../deductionFactors'

import { Sequelize } from 'sequelize'
import { ApplicationService } from '../application'
import {
  ApplicationEventType,
  ApplicationState,
  Staff,
} from '@island.is/financial-aid/shared/lib'

@Injectable()
export class AmountService {
  constructor(
    @InjectModel(AmountModel)
    private readonly amountModel: typeof AmountModel,
    private readonly deductionFactorsService: DeductionFactorsService,
    // private readonly applicationService: ApplicationService,
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(amount: CreateAmountDto, staff?: Staff): Promise<AmountModel> {
    return await this.sequelize.transaction(async (t) => {
      return this.amountModel
        .create(amount, { transaction: t })
        .then(async (res) => {
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
          // await this.applicationService.update(
          //   res.getDataValue('id'),
          //   {
          //     state: ApplicationState.APPROVED,
          //     event: ApplicationEventType.APPROVED,
          //   },
          //   staff,
          // )

          return res
        })
    })
  }
}
