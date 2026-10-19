import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealStatementDeadline } from '../models/appealStatementDeadline.model'

export type CreateAppealStatementDeadline = {
  caseId: string
  appealCaseId: string
  defendantId?: string
  civilClaimantId?: string
  deadline: Date
}

export type UpdateAppealStatementDeadline = Pick<
  CreateAppealStatementDeadline,
  'deadline'
>

@Injectable()
export class AppealStatementDeadlineRepositoryService {
  constructor(
    @InjectModel(AppealStatementDeadline)
    private readonly appealStatementDeadlineModel: typeof AppealStatementDeadline,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: CreateAppealStatementDeadline,
    options: { transaction: Transaction },
  ): Promise<AppealStatementDeadline> {
    try {
      this.logger.debug(
        `Creating an appeal statement deadline for case ${data.caseId} and appeal case ${data.appealCaseId}`,
      )

      const result = await this.appealStatementDeadlineModel.create(data, {
        transaction: options.transaction,
      })

      this.logger.debug(`Created appeal statement deadline ${result.id}`)

      return result
    } catch (error) {
      this.logger.error(
        `Error creating an appeal statement deadline for case ${data.caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Scoped to the appeal as well as the id, so a deadline of another appeal
  // cannot be moved through this one's route.
  async update(
    id: string,
    appealCaseId: string,
    data: UpdateAppealStatementDeadline,
    options: { transaction: Transaction },
  ): Promise<AppealStatementDeadline> {
    try {
      this.logger.debug(
        `Updating appeal statement deadline ${id} of appeal case ${appealCaseId}`,
      )

      const [numberOfAffectedRows, updated] =
        await this.appealStatementDeadlineModel.update(data, {
          where: { id, appealCaseId },
          transaction: options.transaction,
          returning: true,
        })

      if (numberOfAffectedRows < 1 || !updated[0]) {
        throw new InternalServerErrorException(
          `Could not update appeal statement deadline ${id} of appeal case ${appealCaseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating appeal statement deadline ${id} of appeal case ${appealCaseId}`,
        )
      }

      this.logger.debug(`Updated appeal statement deadline ${id}`)

      return updated[0]
    } catch (error) {
      this.logger.error(
        `Error updating appeal statement deadline ${id} of appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }

  // A party's deadlines go with the party. The rows reference the defendant
  // or civil claimant without a cascade, as this schema's appeal children
  // do, so the service deleting the party has to clear them first.
  async deleteAllForDefendant(
    caseId: string,
    defendantId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting the appeal statement deadlines of defendant ${defendantId} of case ${caseId}`,
      )

      return await this.appealStatementDeadlineModel.destroy({
        where: { caseId, defendantId },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting the appeal statement deadlines of defendant ${defendantId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }

  async deleteAllForCivilClaimant(
    caseId: string,
    civilClaimantId: string,
    options: { transaction: Transaction },
  ): Promise<number> {
    try {
      this.logger.debug(
        `Deleting the appeal statement deadlines of civil claimant ${civilClaimantId} of case ${caseId}`,
      )

      return await this.appealStatementDeadlineModel.destroy({
        where: { caseId, civilClaimantId },
        transaction: options.transaction,
      })
    } catch (error) {
      this.logger.error(
        `Error deleting the appeal statement deadlines of civil claimant ${civilClaimantId} of case ${caseId}:`,
        { error },
      )

      throw error
    }
  }
}
