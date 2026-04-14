import { Op, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { Case } from '../models/case.model'
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
   * Distinct LÖKE numbers per case from the junction table (unassigned + defendant-linked).
   * Used as the read path for `Case.policeCaseNumbers` while the legacy array column remains.
   */
  async findDistinctPoliceCaseNumbersByCaseIds(
    caseIds: string[],
    options?: { transaction?: Transaction },
  ): Promise<Map<string, string[]>> {
    const result = new Map<string, string[]>()
    for (const id of caseIds) {
      result.set(id, [])
    }

    if (caseIds.length === 0) {
      return result
    }

    const rows = await this.model.findAll({
      where: { caseId: caseIds },
      attributes: ['caseId', 'policeCaseNumber'],
      transaction: options?.transaction,
    })

    const byCase = new Map<string, Set<string>>()
    for (const id of caseIds) {
      byCase.set(id, new Set())
    }

    for (const row of rows) {
      byCase.get(row.caseId)?.add(row.policeCaseNumber)
    }

    for (const [caseId, set] of byCase) {
      result.set(
        caseId,
        [...set].sort((a, b) => a.localeCompare(b)),
      )
    }

    return result
  }

  /**
   * Sets `policeCaseNumbers` on each case from the junction table when rows exist;
   * otherwise leaves the value loaded from the legacy `case.police_case_numbers` column.
   */
  async resolvePoliceCaseNumbersForCases(
    cases: Case[],
    options?: { transaction?: Transaction },
  ): Promise<void> {
    if (cases.length === 0) {
      return
    }

    try {
      this.logger.debug(
        `Resolving police case numbers from junction for ${cases.length} case(s)`,
      )

      const map = await this.findDistinctPoliceCaseNumbersByCaseIds(
        cases.map((c) => c.id),
        options,
      )

      for (const c of cases) {
        const fromJunction = map.get(c.id) ?? []
        if (fromJunction.length > 0) {
          c.setDataValue('policeCaseNumbers', fromJunction)
        }
      }
    } catch (error) {
      this.logger.error(
        'Error resolving police case numbers from junction for cases',
        { error },
      )

      throw error
    }
  }

  /**
   * Inserts defendant-linked (case_id, defendant_id, police_case_number) rows,
   * ignoring duplicates via the partial unique index, then removes redundant
   * unassigned rows for the same police case numbers on this case.
   */
  async upsertAssignedDefendantPoliceCaseNumbers(
    caseId: string,
    links: ReadonlyArray<{ defendantId: string; policeCaseNumber: string }>,
  ): Promise<void> {
    if (links.length === 0) {
      return
    }

    const sequelize = this.model.sequelize
    if (!sequelize) {
      throw new Error('Sequelize instance unavailable')
    }

    try {
      await sequelize.transaction(async (transaction) => {
        await this.model.bulkCreate(
          links.map(({ defendantId, policeCaseNumber }) => ({
            caseId,
            defendantId,
            policeCaseNumber,
          })),
          { transaction, ignoreDuplicates: true },
        )

        const policeCaseNumbers = [
          ...new Set(links.map((l) => l.policeCaseNumber)),
        ]

        await this.model.destroy({
          where: {
            caseId,
            defendantId: { [Op.is]: null },
            policeCaseNumber: { [Op.in]: policeCaseNumbers },
          },
          transaction,
        })
      })

      this.logger.debug(
        `Upserted ${links.length} defendant-linked police case number row(s) for case ${caseId}`,
      )
    } catch (error) {
      this.logger.error(
        `Error upserting defendant-linked police case number rows for case ${caseId}`,
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
