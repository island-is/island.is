import { Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

import { UpdateIndictmentCountDto } from './dto/updateIndictmentCount.dto'
import { UpdateOffenseDto } from './dto/updateOffense.dto'
import { IndictmentCount } from './models/indictmentCount.model'
import { Offense } from './models/offense.model'

@Injectable()
export class IndictmentCountService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(IndictmentCount)
    private readonly indictmentCountModel: typeof IndictmentCount,
    @InjectModel(Offense) private readonly offenseModel: typeof Offense,
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
    return this.sequelize.transaction(async (transaction) => {
      await this.offenseModel.destroy({
        where: { indictmentCountId },
        transaction,
      })

      const numberOfAffectedRows = await this.indictmentCountModel.destroy({
        where: { id: indictmentCountId, caseId },
        transaction,
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
    })
  }

  async createOffense(
    indictmentCountId: string,
    offense: IndictmentCountOffense,
  ): Promise<Offense> {
    return this.offenseModel.create({ indictmentCountId, offense })
  }

  async updateOffense(
    indictmentCountId: string,
    offenseId: string,
    update: UpdateOffenseDto,
  ): Promise<Offense> {
    const [numberOfAffectedRows, offenses] = await this.offenseModel.update(
      update,
      {
        where: { id: offenseId, indictmentCountId },
        returning: true,
      },
    )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    }

    return offenses[0]
  }

  async deleteOffense(
    indictmentCountId: string,
    offenseId: string,
  ): Promise<boolean> {
    const numberOfAffectedRows = await this.offenseModel.destroy({
      where: { id: offenseId, indictmentCountId },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete offense ${offenseId} for indictment count ${indictmentCountId}`,
      )
    }

    return true
  }
}
