import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSessionStringType } from '@island.is/judicial-system/types'

import { CourtSessionString } from '../models/courtSessionString.model'

// A court session string is addressed by all four columns together - a merged
// case contributes its own string of each type to a session - so the key is a
// named type rather than a caller-supplied where clause. mergedCaseId is absent
// for the session's own strings; stringType is optional only because the DTO the
// only caller receives it from declares it so.
export type CourtSessionStringKey = {
  caseId: string
  courtSessionId: string
  mergedCaseId?: string
  stringType?: CourtSessionStringType
}

export type CreateCourtSessionString = CourtSessionStringKey & {
  value?: string
}

export type UpdateCourtSessionString = {
  value?: string
}

// Sequelize returns [affectedRows, rows] from update; naming the two halves
// keeps the tuple from leaking to callers.
export type UpdatedCourtSessionStrings = {
  numberOfAffectedRows: number
  courtSessionStrings: CourtSessionString[]
}

@Injectable()
export class CourtSessionStringRepositoryService {
  constructor(
    @InjectModel(CourtSessionString)
    private readonly courtSessionStringModel: typeof CourtSessionString,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findByKey(
    key: CourtSessionStringKey,
    options?: { transaction?: Transaction },
  ): Promise<CourtSessionString | null> {
    try {
      this.logger.debug(
        `Finding court session string of type ${key.stringType} for court session ${key.courtSessionId} of case ${key.caseId}`,
      )

      const result = await this.courtSessionStringModel.findOne({
        where: {
          caseId: key.caseId,
          courtSessionId: key.courtSessionId,
          mergedCaseId: key.mergedCaseId,
          stringType: key.stringType,
        },
        transaction: options?.transaction,
      })

      this.logger.debug(
        `Court session string of type ${key.stringType} for court session ${
          key.courtSessionId
        } of case ${key.caseId} ${result ? 'found' : 'not found'}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error finding court session string of type ${key.stringType} for court session ${key.courtSessionId} of case ${key.caseId}:`,
        { error },
      )

      throw error
    }
  }

  // The caller decides what an unexpected row count means - a court session
  // string carries no identity of its own beyond its key, so both halves of the
  // count are reported rather than enforced here.
  async updateByKey(
    key: CourtSessionStringKey,
    update: UpdateCourtSessionString,
    options?: { transaction?: Transaction },
  ): Promise<UpdatedCourtSessionStrings> {
    try {
      this.logger.debug(
        `Updating court session string of type ${key.stringType} for court session ${key.courtSessionId} of case ${key.caseId} with data:`,
        { data: Object.keys(update) },
      )

      const [numberOfAffectedRows, courtSessionStrings] =
        await this.courtSessionStringModel.update(update, {
          where: {
            caseId: key.caseId,
            courtSessionId: key.courtSessionId,
            mergedCaseId: key.mergedCaseId,
            stringType: key.stringType,
          },
          transaction: options?.transaction,
          returning: true,
        })

      return { numberOfAffectedRows, courtSessionStrings }
    } catch (error) {
      this.logger.error(
        `Error updating court session string of type ${key.stringType} for court session ${key.courtSessionId} of case ${key.caseId} with data:`,
        { data: Object.keys(update), error },
      )

      throw error
    }
  }

  async create(
    courtSessionString: CreateCourtSessionString,
    options?: { transaction?: Transaction },
  ): Promise<CourtSessionString> {
    try {
      this.logger.debug(
        `Creating a court session string of type ${courtSessionString.stringType} for court session ${courtSessionString.courtSessionId} of case ${courtSessionString.caseId}`,
      )

      return await this.courtSessionStringModel.create(courtSessionString, {
        transaction: options?.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error creating a court session string of type ${courtSessionString.stringType} for court session ${courtSessionString.courtSessionId} of case ${courtSessionString.caseId}:`,
        { error },
      )

      throw error
    }
  }
}
