import { Op, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CaseState } from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
import { CivilClaimant } from '../models/civilClaimant.model'

export type UpdateCivilClaimant = {
  noNationalId?: boolean
  nationalId?: string
  name?: string
  hasSpokesperson?: boolean
  spokespersonIsLawyer?: boolean
  spokespersonNationalId?: string
  spokespersonName?: string
  spokespersonEmail?: string
  spokespersonPhoneNumber?: string
  caseFilesSharedWithSpokesperson?: boolean
  isSpokespersonConfirmed?: boolean
  policeCaseNumbers?: string[]
  defendantIds?: string[]
}

// Sequelize returns [affectedRows, rows] from update; naming the two halves keeps
// the tuple from leaking to callers.
export type UpdatedCivilClaimants = {
  numberOfAffectedRows: number
  civilClaimants: CivilClaimant[]
}

@Injectable()
export class CivilClaimantRepositoryService {
  constructor(
    @InjectModel(CivilClaimant)
    private readonly civilClaimantModel: typeof CivilClaimant,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<CivilClaimant> {
    try {
      this.logger.debug(`Creating a civil claimant for case ${caseId}`)

      return await this.civilClaimantModel.create(
        { caseId },
        { transaction: options.transaction },
      )
    } catch (error) {
      this.logger.error(`Error creating a civil claimant for case ${caseId}:`, {
        error,
      })

      throw error
    }
  }

  // A civil claimant is only addressable within its own case, so both keys are
  // named parameters rather than a caller-supplied where clause.
  async updateByIdAndCase(
    civilClaimantId: string,
    caseId: string,
    update: UpdateCivilClaimant,
  ): Promise<UpdatedCivilClaimants> {
    try {
      this.logger.debug(
        `Updating civil claimant ${civilClaimantId} of case ${caseId}`,
      )

      const [numberOfAffectedRows, civilClaimants] =
        await this.civilClaimantModel.update(update, {
          where: { id: civilClaimantId, caseId },
          returning: true,
        })

      return { numberOfAffectedRows, civilClaimants }
    } catch (error) {
      this.logger.error(
        `Error updating civil claimant ${civilClaimantId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteByIdAndCase(
    civilClaimantId: string,
    caseId: string,
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting civil claimant ${civilClaimantId} of case ${caseId}`,
      )

      return await this.civilClaimantModel.destroy({
        where: { id: civilClaimantId, caseId },
      })
    } catch (error) {
      this.logger.error(
        `Error deleting civil claimant ${civilClaimantId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteAllForCase(
    caseId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(`Deleting all civil claimants of case ${caseId}`)

      return await this.civilClaimantModel.destroy({
        where: { caseId },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting all civil claimants of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Only claimants on a live case count, and "latest" is part of the operation
  // rather than an ordering the caller gets to choose.
  async findLatestBySpokespersonNationalId(
    nationalId: string,
  ): Promise<CivilClaimant | null> {
    try {
      this.logger.debug(
        'Finding the latest civil claimant by spokesperson national id',
      )

      return await this.civilClaimantModel.findOne({
        include: [
          {
            model: Case,
            as: 'case',
            where: {
              state: { [Op.not]: CaseState.DELETED },
              isArchived: false,
            },
          },
        ],
        where: { hasSpokesperson: true, spokespersonNationalId: nationalId },
        order: [['created', 'DESC']],
      })
    } catch (error) {
      this.logger.error(
        'Error finding the latest civil claimant by spokesperson national id:',
        { error },
      )

      throw error
    }
  }
}
