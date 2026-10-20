import { Transaction } from 'sequelize'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseType,
  type User,
} from '@island.is/judicial-system/types'

import { queueMessagesAfterCommit } from '../../middleware/queueMessagesAfterCommit'
import {
  AppealCase,
  AppealCourtSession,
  AppealCourtSessionRepositoryService,
  Case,
} from '../repository'
import { CreateAppealCourtSessionDto } from './dto/createAppealCourtSession.dto'
import { UpdateAppealCourtSessionDto } from './dto/updateAppealCourtSession.dto'

@Injectable()
export class AppealCourtSessionService {
  constructor(
    private readonly appealCourtSessionRepositoryService: AppealCourtSessionRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Books a session in a verdict appeal and tells the parties once the
  // booking has committed.
  async create(
    theCase: Case,
    appealCase: AppealCase,
    dto: CreateAppealCourtSessionDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealCourtSession> {
    // A ruling appeal is decided on the papers, so the route exists only for
    // the verdict appeal. The guard has already matched the appeal to the
    // case; this is the one thing it does not check.
    if (appealCase.appealType !== AppealCaseType.VERDICT) {
      throw new BadRequestException(
        `Appeal case ${appealCase.id} of case ${theCase.id} is not a verdict appeal`,
      )
    }

    this.logger.debug(
      `Creating an appeal court session for case ${theCase.id} and appeal case ${appealCase.id}`,
    )

    const session = await this.appealCourtSessionRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        sessionType: dto.sessionType,
        sessionDate: dto.sessionDate,
        courtRoom: dto.courtRoom,
      },
      { transaction },
    )

    queueMessagesAfterCommit({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: {
        type: AppealCaseNotificationType.APPEAL_COURT_SESSION_BOOKED,
        appealCourtSessionId: session.id,
      },
    })

    return session
  }

  // Changes a booked session. No verdict-appeal check here or on delete: the
  // session the guard resolved hangs off the appeal, and only a verdict
  // appeal can have one.
  async update(
    theCase: Case,
    appealCase: AppealCase,
    session: AppealCourtSession,
    dto: UpdateAppealCourtSessionDto,
    transaction: Transaction,
  ): Promise<AppealCourtSession> {
    const update = {
      ...(dto.sessionType !== undefined && { sessionType: dto.sessionType }),
      ...(dto.sessionDate !== undefined && { sessionDate: dto.sessionDate }),
      ...(dto.courtRoom !== undefined && { courtRoom: dto.courtRoom }),
    }

    if (Object.keys(update).length === 0) {
      throw new BadRequestException(
        `Nothing to update in appeal court session ${session.id} of case ${theCase.id}`,
      )
    }

    this.logger.debug(
      `Updating appeal court session ${session.id} of appeal case ${appealCase.id} in case ${theCase.id}`,
    )

    return this.appealCourtSessionRepositoryService.update(
      session.id,
      appealCase.id,
      update,
      { transaction },
    )
  }

  async delete(
    theCase: Case,
    appealCase: AppealCase,
    session: AppealCourtSession,
    transaction: Transaction,
  ): Promise<boolean> {
    this.logger.debug(
      `Deleting appeal court session ${session.id} of appeal case ${appealCase.id} in case ${theCase.id}`,
    )

    return this.appealCourtSessionRepositoryService.delete(
      session.id,
      appealCase.id,
      { transaction },
    )
  }
}
