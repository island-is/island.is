import { Transaction } from 'sequelize/types'
import { Sequelize } from 'sequelize-typescript'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectConnection, InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  IndictmentCountOffense,
  isTrafficViolationIndictmentCount,
} from '@island.is/judicial-system/types'

import { IndictmentCount, Offense } from '../repository'
import { UpdateIndictmentCountDto } from './dto/updateIndictmentCount.dto'
import { UpdateOffenseDto } from './dto/updateOffense.dto'

@Injectable()
export class IndictmentCountService {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(IndictmentCount)
    private readonly indictmentCountModel: typeof IndictmentCount,
    @InjectModel(Offense) private readonly offenseModel: typeof Offense,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findById(indictmentCountId: string): Promise<IndictmentCount> {
    const indictmentCount = await this.indictmentCountModel.findByPk(
      indictmentCountId,
      {
        include: [
          {
            model: Offense,
            as: 'offenses',
            required: false,
            separate: true,
            order: [['created', 'ASC']],
          },
        ],
      },
    )

    if (!indictmentCount) {
      throw new NotFoundException(
        `IndictmentCount ${indictmentCountId} not found`,
      )
    }

    return indictmentCount
  }

  async create(caseId: string): Promise<IndictmentCount> {
    return this.indictmentCountModel.create({ caseId })
  }

  async update(
    caseId: string,
    indictmentCountId: string,
    update: UpdateIndictmentCountDto,
    transaction?: Transaction,
  ): Promise<IndictmentCount> {
    const updateWithTransaction = async (transaction: Transaction) => {
      const policeCaseNumberSubtypes = update.policeCaseNumberSubtypes
      const updatedSubtypes = update.indictmentCountSubtypes
      if (!policeCaseNumberSubtypes || !updatedSubtypes) {
        return this.indictmentCountModel.update(update, {
          where: { id: indictmentCountId, caseId },
          returning: true,
          transaction,
        })
      }

      const isTrafficViolation = isTrafficViolationIndictmentCount(
        updatedSubtypes,
        policeCaseNumberSubtypes,
      )

      // if traffic violation subtype is not present we need to handle a cascading update
      // for indictment count and offenses
      const updatedIndictmentCount = !isTrafficViolation
        ? {
            ...update,
            vehicleRegistrationNumber: null,
            recordedSpeed: null,
            speedLimit: null,
            lawsBroken: [], // currently we only support traffic violation laws broken
            legalArguments: '', // currently we set traffic violation legal arguments based on laws broken
          }
        : update

      if (!isTrafficViolation) {
        // currently offenses only exist for traffic violation indictment subtype.
        // if we support other offenses per subtype in the future we have to take the subtype into account
        await this.offenseModel.destroy({
          where: { indictmentCountId },
          transaction,
        })
      }

      return this.indictmentCountModel.update(updatedIndictmentCount, {
        where: { id: indictmentCountId, caseId },
        returning: true,
        transaction,
      })
    }

    const updateWithInternalTransaction = () =>
      this.sequelize.transaction(async (transaction) =>
        updateWithTransaction(transaction),
      )

    const promisedUpdate = transaction
      ? updateWithTransaction(transaction)
      : updateWithInternalTransaction()

    const [numberOfAffectedRows] = await promisedUpdate

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

    const indictmentCount = await this.indictmentCountModel.findOne({
      where: { id: indictmentCountId, caseId },
      include: [
        {
          model: Offense,
          as: 'offenses',
          required: false,
          order: [['created', 'ASC']],
          separate: true,
        },
      ],
      transaction,
    })

    if (!indictmentCount) {
      throw new InternalServerErrorException(
        `Could not find indictment count ${indictmentCountId} of case ${caseId}`,
      )
    }

    return indictmentCount
  }

  async delete(
    caseId: string,
    indictmentCountId: string,
    transaction?: Transaction,
  ): Promise<boolean> {
    const deleteWithTransaction = async (transaction: Transaction) => {
      await this.offenseModel.destroy({
        where: { indictmentCountId },
        transaction,
      })

      return this.indictmentCountModel.destroy({
        where: { id: indictmentCountId, caseId },
        transaction,
      })
    }

    const deleteWithInternalTransaction = () =>
      this.sequelize.transaction(async (transaction) => {
        return deleteWithTransaction(transaction)
      })

    const numberOfAffectedRows = transaction
      ? await deleteWithTransaction(transaction)
      : await deleteWithInternalTransaction()

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
