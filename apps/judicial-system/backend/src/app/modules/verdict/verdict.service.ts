import { Transaction } from 'sequelize'

import {
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { UpdateVerdictDto } from './dto/updateVerdict.dto'
import { Verdict } from './models/verdict.model'

export class VerdictService {
  constructor(
    @InjectModel(Verdict) private readonly verdictModel: typeof Verdict,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(verdictId: string): Promise<Verdict> {
    const verdict = await this.verdictModel.findOne({
      where: { id: verdictId },
    })

    if (!verdict) {
      throw new NotFoundException(`Verdict ${verdictId} does not exist`)
    }

    return verdict
  }

  async createVerdict(
    defendantId: string,
    caseId: string,
    transaction: Transaction,
  ): Promise<Verdict> {
    return this.verdictModel.create({ defendantId, caseId }, { transaction })
  }

  async updateVerdict(
    verdict: Verdict,
    update: UpdateVerdictDto,
  ): Promise<Verdict> {
    const [numberOfAffectedRows, updatedVerdict] =
      await this.verdictModel.update(update, {
        where: { id: verdict.id },
        returning: true,
      })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows ${numberOfAffectedRows} affected when updating verdict`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update verdict ${verdict.id}`,
      )
    }

    return updatedVerdict[0]
  }
}
