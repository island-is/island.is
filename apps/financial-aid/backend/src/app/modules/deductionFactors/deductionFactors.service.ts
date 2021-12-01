import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { DeductionFactorsModel } from './models'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class DeductionFactorsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(DeductionFactorsModel)
    private readonly deductionFactorsModel: typeof DeductionFactorsModel,
  ) {}

  // async create(aid: CreateAidDto, t: Transaction): Promise<AidModel> {
  //   this.logger.debug(`Create deduction factors`)
  //   return this.aidModel.create(aid, { transaction: t })
  // }
}
