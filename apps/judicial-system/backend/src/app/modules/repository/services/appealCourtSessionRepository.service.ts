import { Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCourtSessionType } from '@island.is/judicial-system/types'

import { AppealCourtSession } from '../models/appealCourtSession.model'

export type CreateAppealCourtSession = {
  caseId: string
  appealCaseId: string
  sessionType: AppealCourtSessionType
  sessionDate: Date
  courtRoom: string
}

export type UpdateAppealCourtSession = Partial<
  Pick<CreateAppealCourtSession, 'sessionType' | 'sessionDate' | 'courtRoom'>
>

@Injectable()
export class AppealCourtSessionRepositoryService {
  constructor(
    @InjectModel(AppealCourtSession)
    private readonly appealCourtSessionModel: typeof AppealCourtSession,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    data: CreateAppealCourtSession,
    options: { transaction: Transaction },
  ): Promise<AppealCourtSession> {
    try {
      this.logger.debug(
        `Creating an appeal court session for case ${data.caseId} and appeal case ${data.appealCaseId}`,
      )

      const result = await this.appealCourtSessionModel.create(data, {
        transaction: options.transaction,
      })

      this.logger.debug(`Created appeal court session ${result.id}`)

      return result
    } catch (error) {
      this.logger.error(
        `Error creating an appeal court session for case ${data.caseId}:`,
        { error },
      )

      throw error
    }
  }

  // Scoped to the appeal as well as the id, so a session id from another
  // appeal cannot be written through this one's route.
  async update(
    id: string,
    appealCaseId: string,
    data: UpdateAppealCourtSession,
    options: { transaction: Transaction },
  ): Promise<AppealCourtSession> {
    try {
      this.logger.debug(
        `Updating appeal court session ${id} of appeal case ${appealCaseId} with data:`,
        { data: Object.keys(data) },
      )

      const [numberOfAffectedRows, updated] =
        await this.appealCourtSessionModel.update(data, {
          where: { id, appealCaseId },
          transaction: options.transaction,
          returning: true,
        })

      if (numberOfAffectedRows < 1 || !updated[0]) {
        throw new InternalServerErrorException(
          `Could not update appeal court session ${id} of appeal case ${appealCaseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating appeal court session ${id} of appeal case ${appealCaseId}`,
        )
      }

      this.logger.debug(`Updated appeal court session ${id}`)

      return updated[0]
    } catch (error) {
      this.logger.error(
        `Error updating appeal court session ${id} of appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }

  async delete(
    id: string,
    appealCaseId: string,
    options: { transaction: Transaction },
  ): Promise<boolean> {
    try {
      this.logger.debug(
        `Deleting appeal court session ${id} of appeal case ${appealCaseId}`,
      )

      const numberOfDeletedRows = await this.appealCourtSessionModel.destroy({
        where: { id, appealCaseId },
        transaction: options.transaction,
      })

      if (numberOfDeletedRows < 1) {
        throw new InternalServerErrorException(
          `Could not delete appeal court session ${id} of appeal case ${appealCaseId}`,
        )
      }

      if (numberOfDeletedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfDeletedRows}) affected when deleting appeal court session ${id} of appeal case ${appealCaseId}`,
        )
      }

      this.logger.debug(`Deleted appeal court session ${id}`)

      return true
    } catch (error) {
      this.logger.error(
        `Error deleting appeal court session ${id} of appeal case ${appealCaseId}:`,
        { error },
      )

      throw error
    }
  }
}
