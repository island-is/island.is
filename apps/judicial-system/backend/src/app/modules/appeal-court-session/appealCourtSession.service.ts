import { Transaction } from 'sequelize'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { AppealCaseType } from '@island.is/judicial-system/types'

import {
  AppealCase,
  AppealCourtSession,
  AppealCourtSessionRepositoryService,
  Case,
} from '../repository'
import { CreateAppealCourtSessionDto } from './dto/createAppealCourtSession.dto'

@Injectable()
export class AppealCourtSessionService {
  constructor(
    private readonly appealCourtSessionRepositoryService: AppealCourtSessionRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Books a session in a verdict appeal.
  async create(
    theCase: Case,
    appealCase: AppealCase,
    dto: CreateAppealCourtSessionDto,
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

    return this.appealCourtSessionRepositoryService.create(
      {
        caseId: theCase.id,
        appealCaseId: appealCase.id,
        sessionType: dto.sessionType,
        sessionDate: dto.sessionDate,
        courtRoom: dto.courtRoom,
      },
      { transaction },
    )
  }
}
