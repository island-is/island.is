import { Transaction } from 'sequelize/types'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { UpdateIndictmentCountDto } from './dto/updateIndictmentCount.dto'
import { IndictmentCount } from './models/indictmentCount.model'

@Injectable()
export class IndictmentCountService {
  constructor(
    @InjectModel(IndictmentCount)
    private readonly indictmentCountModel: typeof IndictmentCount,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(caseId: string): Promise<IndictmentCount> {
    return this.indictmentCountModel.create({ caseId })
  }

  async update(
    caseId: string,
    indictmentCountId: string,
    update: UpdateIndictmentCountDto,
    transaction?: Transaction,
  ): Promise<IndictmentCount> {
    const promisedUpdate = transaction
      ? this.indictmentCountModel.update(update, {
          where: { id: indictmentCountId, caseId },
          returning: true,
          transaction,
        })
      : this.indictmentCountModel.update(update, {
          where: { id: indictmentCountId, caseId },
          returning: true,
        })

    const [numberOfAffectedRows, indictmentCounts] = await promisedUpdate

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating indictment count ${indictmentCountId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update indictment count ${indictmentCountId} of case ${caseId}`,
      )
    }

    return indictmentCounts[0]
  }

  async delete(caseId: string, indictmentCountId: string): Promise<boolean> {
    const numberOfAffectedRows = await this.indictmentCountModel.destroy({
      where: { id: indictmentCountId, caseId },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting indictment count ${indictmentCountId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete indictment count ${indictmentCountId} of case ${caseId}`,
      )
    }

    return true
  }
}
