import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
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
}
