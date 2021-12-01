import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { AmountModel } from './models'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Amount } from '@island.is/financial-aid/shared/lib'
import { Transaction } from 'sequelize/types'
import { CreateAmountDto } from './dto'
import { CreateDeductionFactorsDto } from '../deductionFactors/dto/createDeductionFactors.dto'
import { DeductionFactorsService } from '../deductionFactors'

@Injectable()
export class AmountService {
  sequelize: any
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(AmountModel)
    private readonly amountModel: typeof AmountModel,
    private readonly deductionFactorsService: DeductionFactorsService,
  ) {}

  async create(amount: CreateAmountDto): Promise<AmountModel> {
    console.log('you came here ', amount)
    return

    // return await this.sequelize.transaction(async (t) => {
    //   return await Promise.all(
    //     Object.values(AidType).map((item) => {
    //       return this.aidService.create(
    //         {
    //           municipalityId: municipality.municipalityId,
    //           type: item,
    //         },
    //         t,
    //       )
    //     }),
    //   )
    // })
  }
}
