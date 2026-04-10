import { Op, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CaseDefendantPoliceCaseNumber } from '../models/caseDefendantPoliceCaseNumber.model'

interface ReplaceUnassignedOptions {
  transaction: Transaction
}

@Injectable()
export class CaseDefendantPoliceCaseNumberRepositoryService {
  constructor(
    @InjectModel(CaseDefendantPoliceCaseNumber)
    private readonly model: typeof CaseDefendantPoliceCaseNumber,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * Replaces only rows with defendant_id NULL for this case (PR 1: array-derived links).
   * Rows with a defendant_id set are left unchanged for future PRs.
   */
  async replaceUnassignedFromPoliceCaseNumbersArray(
    caseId: string,
    policeCaseNumbers: string[],
    options: ReplaceUnassignedOptions,
  ): Promise<void> {
    const { transaction } = options

    try {
      this.logger.debug(
        `Replacing unassigned case–defendant–police case number rows for case ${caseId}`,
      )

      await this.model.destroy({
        where: { caseId, defendantId: { [Op.is]: null } },
        transaction,
      })

      const distinct = [
        ...new Set(
          policeCaseNumbers
            .map((policeCaseNumber) => policeCaseNumber.trim())
            .filter((policeCaseNumber) => policeCaseNumber.length > 0),
        ),
      ]

      if (distinct.length === 0) {
        return
      }

      await this.model.bulkCreate(
        distinct.map((policeCaseNumber) => ({
          caseId,
          defendantId: null,
          policeCaseNumber,
        })),
        { transaction },
      )

      this.logger.debug(
        `Replaced unassigned police case number rows for case ${caseId} (${distinct.length} numbers)`,
      )
    } catch (error) {
      this.logger.error(
        `Error replacing unassigned police case number rows for case ${caseId}`,
        { error },
      )

      throw error
    }
  }

  /**
   * When a defendant is split to a new case, move attributed links to the new case_id.
   */
  async moveAssignedRowsToCaseForDefendant(
    fromCaseId: string,
    toCaseId: string,
    defendantId: string,
    options: ReplaceUnassignedOptions,
  ): Promise<void> {
    const { transaction } = options

    try {
      await this.model.update(
        { caseId: toCaseId },
        {
          where: {
            caseId: fromCaseId,
            defendantId,
          },
          transaction,
        },
      )
    } catch (error) {
      this.logger.error(
        `Error moving police case number rows for defendant ${defendantId} to case ${toCaseId}`,
        { error },
      )

      throw error
    }
  }
}
