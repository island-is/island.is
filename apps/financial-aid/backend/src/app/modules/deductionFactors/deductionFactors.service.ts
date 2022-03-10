import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { DeductionFactorsModel } from './models'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CreateDeductionFactorsDto } from './dto/createDeductionFactors.dto'
import { Transaction } from 'sequelize/types'

@Injectable()
export class DeductionFactorsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(DeductionFactorsModel)
    private readonly deductionFactorsModel: typeof DeductionFactorsModel,
  ) {}

  async create(
    deductionFactors: CreateDeductionFactorsDto,
    t: Transaction,
  ): Promise<DeductionFactorsModel> {
    this.logger.debug(`Create deduction factors`)
    return this.deductionFactorsModel.create(deductionFactors, {
      transaction: t,
    })
  }
}
