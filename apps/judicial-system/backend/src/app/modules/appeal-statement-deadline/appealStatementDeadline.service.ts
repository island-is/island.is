import { Transaction } from 'sequelize'

import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseType,
  type AppealStatementParty,
  CaseFileCategory,
  CaseFileState,
  findAppealStatementDeadline,
  hasFiledAppealStatement,
  isSameAppealStatementParty,
  type User,
} from '@island.is/judicial-system/types'

import { queueMessagesAfterCommit } from '../../middleware'
import {
  buildStatementDeadlineEvent,
  buildStatementFiledEvent,
} from '../appeal-case/appealCase.helpers'
import {
  AppealCase,
  AppealEventLog,
  AppealEventLogRepositoryService,
  AppealStatementDeadline,
  AppealStatementDeadlineRepositoryService,
  Case,
} from '../repository'
import { FileAppealStatementDto } from './dto/fileAppealStatement.dto'
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
    this.assertVerdictAppeal(theCase, appealCase)

    const party = this.resolveParty(theCase, dto)

    // The screen locks the date once the statement is in, and this is the
    // same rule where the screen cannot reach.
    this.assertStatementNotFiled(theCase, appealCase, party)

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

  // Records that a party's statement is in, filed by the court of appeals on
  // the party's behalf when it arrived outside the system. The court uploads
  // the statement first, through the file routes; this writes the event the
  // party itself would have written, so the deadline locks and the party reads
  // as "skilað" wherever the event is consulted. No mails: the court knows,
  // and nobody has asked that the parties be told.
  async fileStatement(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
    dto: FileAppealStatementDto,
    transaction: Transaction,
  ): Promise<AppealEventLog> {
    this.assertVerdictAppeal(theCase, appealCase)

    const party = this.resolveParty(theCase, dto)

    // A statement is filed once. A party that has already filed, itself or
    // through the court, is not filed for again.
    this.assertStatementNotFiled(theCase, appealCase, party)

    // The event says the statement is in; a statement must be, or the party
    // would read as having filed nothing anyone can open.
    if (!this.hasStatementFile(theCase, party)) {
      throw new BadRequestException(
        `No statement has been uploaded for the party in appeal case ${appealCase.id} of case ${theCase.id}`,
      )
    }

    this.logger.debug(
      `Filing a statement on a party's behalf in appeal case ${appealCase.id} of case ${theCase.id}`,
    )

    return this.appealEventLogRepositoryService.create(
      buildStatementFiledEvent({ theCase, appealCase, party, actor: user }),
      { transaction },
    )
  }

  // A ruling appeal is decided on the papers already filed, so the routes
  // exist only for the verdict appeal. The guard has matched the appeal to
  // the case; this is the one thing it does not check.
  private assertVerdictAppeal(theCase: Case, appealCase: AppealCase): void {
    if (appealCase.appealType !== AppealCaseType.VERDICT) {
      throw new BadRequestException(
        `Appeal case ${appealCase.id} of case ${theCase.id} is not a verdict appeal`,
      )
    }
  }

  private assertStatementNotFiled(
    theCase: Case,
    appealCase: AppealCase,
    party: AppealStatementParty,
  ): void {
    if (hasFiledAppealStatement(appealCase.appealEventLogs, party)) {
      throw new BadRequestException(
        `The party has already filed its statement in appeal case ${appealCase.id} of case ${theCase.id}`,
      )
    }
  }

  // Whether the party's verdict appeal statement is on the case. The
  // prosecution's statement is the one naming no party, as its event is.
  private hasStatementFile(
    theCase: Case,
    party: AppealStatementParty,
  ): boolean {
    const category =
      party.defendantId || party.civilClaimantId
        ? CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT
        : CaseFileCategory.PROSECUTOR_VERDICT_APPEAL_STATEMENT

    return Boolean(
      theCase.caseFiles?.some(
        (file) =>
          file.state !== CaseFileState.DELETED &&
          file.category === category &&
          isSameAppealStatementParty(file, party),
      ),
    )
  }

  // The party the request names must be one of the case's own. The ids come
  // from the body, so nothing upstream has checked them against the case.
  private resolveParty(
    theCase: Case,
    dto: FileAppealStatementDto,
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
