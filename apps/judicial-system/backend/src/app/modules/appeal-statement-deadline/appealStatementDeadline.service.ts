import { Transaction } from 'sequelize'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseType,
  type AppealStatementParty,
  findAppealStatementDeadline,
  hasFiledAppealStatement,
  type User,
} from '@island.is/judicial-system/types'

import { queueMessagesAfterCommit } from '../../middleware'
import { buildStatementDeadlineEvent } from '../appeal-case/appealCase.helpers'
import {
  AppealCase,
  AppealEventLogRepositoryService,
  AppealStatementDeadline,
  AppealStatementDeadlineRepositoryService,
  Case,
} from '../repository'
import { SetAppealStatementDeadlineDto } from './dto/setAppealStatementDeadline.dto'

@Injectable()
export class AppealStatementDeadlineService {
  constructor(
    private readonly appealStatementDeadlineRepositoryService: AppealStatementDeadlineRepositoryService,
    private readonly appealEventLogRepositoryService: AppealEventLogRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Gives a party its deadline to file a statement, or moves the deadline it
  // already has. One route for both: the row decides which, and the event
  // written alongside tells them apart for the record and the mails.
  async set(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
    dto: SetAppealStatementDeadlineDto,
    transaction: Transaction,
  ): Promise<AppealStatementDeadline> {
    // A ruling appeal is decided on the papers already filed, so the route
    // exists only for the verdict appeal. The guard has matched the appeal to
    // the case; this is the one thing it does not check.
    if (appealCase.appealType !== AppealCaseType.VERDICT) {
      throw new BadRequestException(
        `Appeal case ${appealCase.id} of case ${theCase.id} is not a verdict appeal`,
      )
    }

    const party = this.resolveParty(theCase, dto)

    // The screen locks the date once the statement is in, and this is the
    // same rule where the screen cannot reach.
    if (hasFiledAppealStatement(appealCase.appealEventLogs, party)) {
      throw new BadRequestException(
        `The party has already filed its statement in appeal case ${appealCase.id} of case ${theCase.id}`,
      )
    }

    const current = findAppealStatementDeadline(
      appealCase.statementDeadlines,
      party,
    )

    if (current && dto.deadline.getTime() <= current.deadline.getTime()) {
      throw new BadRequestException(
        `An extension must move the deadline in appeal case ${appealCase.id} of case ${theCase.id} later than it is`,
      )
    }

    this.logger.debug(
      `${
        current ? 'Extending' : 'Setting'
      } a statement deadline in appeal case ${appealCase.id} of case ${
        theCase.id
      }`,
    )

    const deadline = current
      ? await this.appealStatementDeadlineRepositoryService.update(
          current.id,
          appealCase.id,
          { deadline: dto.deadline },
          { transaction },
        )
      : await this.appealStatementDeadlineRepositoryService.create(
          {
            caseId: theCase.id,
            appealCaseId: appealCase.id,
            defendantId: party.defendantId ?? undefined,
            civilClaimantId: party.civilClaimantId ?? undefined,
            deadline: dto.deadline,
          },
          { transaction },
        )

    // Written in the same transaction as the deadline so the two cannot
    // drift: the row keeps the date, the event who gave it and when.
    await this.appealEventLogRepositoryService.create(
      buildStatementDeadlineEvent({
        theCase,
        appealCase,
        party,
        actor: user,
        extended: Boolean(current),
      }),
      { transaction },
    )

    // The mails follow: to the party, that it has the time, and to everyone
    // else, that it does. Queued after commit, so a deadline that rolls
    // back announces nothing. The mail reads the date off the appeal.
    queueMessagesAfterCommit({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: {
        type: current
          ? AppealCaseNotificationType.APPEAL_STATEMENT_DEADLINE_EXTENDED
          : AppealCaseNotificationType.APPEAL_STATEMENT_DEADLINE_SET,
        defendantId: party.defendantId ?? undefined,
        civilClaimantId: party.civilClaimantId ?? undefined,
      },
    })

    return deadline
  }

  // The party the request names must be one of the case's own. The ids come
  // from the body, so nothing upstream has checked them against the case.
  private resolveParty(
    theCase: Case,
    dto: SetAppealStatementDeadlineDto,
  ): AppealStatementParty {
    if (dto.defendantId && dto.civilClaimantId) {
      throw new BadRequestException(
        `A statement deadline belongs to one party, but both a defendant and a civil claimant were named in case ${theCase.id}`,
      )
    }

    if (dto.defendantId) {
      if (!theCase.defendants?.some((d) => d.id === dto.defendantId)) {
        throw new BadRequestException(
          `Defendant ${dto.defendantId} not found in case ${theCase.id}`,
        )
      }

      return { defendantId: dto.defendantId }
    }

    if (dto.civilClaimantId) {
      if (!theCase.civilClaimants?.some((c) => c.id === dto.civilClaimantId)) {
        throw new BadRequestException(
          `Civil claimant ${dto.civilClaimantId} not found in case ${theCase.id}`,
        )
      }

      return { civilClaimantId: dto.civilClaimantId }
    }

    return {}
  }
}
