import { Injectable, Inject } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { AidModel } from './models'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Aid, AidType } from '@island.is/financial-aid/shared/lib'
import { Transaction } from 'sequelize/types'
import { CreateAidDto } from './dto'

@Injectable()
export class AidService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @InjectModel(AidModel)
    private readonly aidModel: typeof AidModel,
  ) {}

  async create(aid: CreateAidDto, t: Transaction): Promise<AidModel> {
    this.logger.debug(`Create aid`)
    return this.aidModel.create(aid, { transaction: t })
  }

  async findById(id: string): Promise<AidModel> {
    this.logger.debug(`Finding aid by id ${id}`)
    return this.aidModel.findOne({
      where: {
        id,
      },
    })
  }

  async findIdByType(type: AidType): Promise<string> {
    this.logger.debug(`Finding aid by id by type: ${type}`)
    const findAid = await this.aidModel.findOne({
      where: {
        type,
      },
    })
    console.log(findAid ? findAid.id : undefined)
    return findAid ? findAid.id : undefined
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
