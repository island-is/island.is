import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { AidModel } from './models'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Aid } from '@island.is/financial-aid/shared/lib'
import { Transaction } from 'sequelize/types'

@Injectable()
export class AidService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(AidModel)
    private readonly aidModel: typeof AidModel,
  ) {}

  async findById(id: string): Promise<AidModel> {
    this.logger.debug(`Finding aid by id ${id}`)
    return this.aidModel.findOne({
      where: {
        id,
      },
    })
  }

  async updateAid(
    aid: Aid,
    municipalityId: string,
    t: Transaction,
  ): Promise<[affectedRows: number, updateAid: Aid[]]> {
    this.logger.debug(`updating aid for ${municipalityId} type ${aid.type}`)
    return this.aidModel.update(aid, {
      where: {
        municipalityId,
        type: aid.type,
      },
      transaction: t,
    })
  }
}
