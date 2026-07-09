import { Transaction } from 'sequelize'

import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealCaseTransition,
  AppealEventType,
  CaseAppealDecision,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  isCompletedCase,
  isDefenceUser,
  isIndictmentCase,
  isProsecutionUser,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../factories'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
  CivilClaimant,
  Defendant,
  UpdateAppealCase,
} from '../repository'
import { UpdateAppealCaseDto } from './dto/updateAppealCase.dto'
import {
  AppealTransitionResult,
  transitionAppealCase,
} from './state/appealCase.state'
import { appealCaseModuleConfig } from './appealCase.config'
import {
  findUserRulingOrderAppealDecision,
  isInCourtRulingOrderAppeal,
  userRulingOrderAppealDecisions,
} from './appealCase.helpers'

@Injectable()
export class AppealCaseService {
  constructor(
    private readonly appealCaseRepositoryService: AppealCaseRepositoryService,
    @Inject(forwardRef(() => CaseRepositoryService))
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly appealEventLogRepositoryService: AppealEventLogRepositoryService,
    private readonly appealDecisionRepositoryService: AppealDecisionRepositoryService,
    @Inject(appealCaseModuleConfig.KEY)
    private readonly config: ConfigType<typeof appealCaseModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  // Every defence party (defendant / civil claimant) the user currently, and
  // confirmedly, represents on the case. A defence event is recorded once per
  // party, so a lawyer who represents several clients appeals (or submits a
  // statement) on behalf of all of them - the backend resolves this, the client
  // never has to pick. Empty for request cases (collective defence, no party)
  // and non-defence users.
  private resolveDefenceParties(
    theCase: Case,
    user: User,
  ): { defendantId?: string; civilClaimantId?: string }[] {
    if (!isIndictmentCase(theCase.type)) {
      return []
    }

    const parties: { defendantId?: string; civilClaimantId?: string }[] = []

    for (const defendant of theCase.defendants ?? []) {
      if (
        Defendant.isConfirmedDefenderOfDefendant(user.nationalId, [defendant])
      ) {
        parties.push({ defendantId: defendant.id })
      }
    }

    for (const civilClaimant of theCase.civilClaimants ?? []) {
      if (
        CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(user.nationalId, [
          civilClaimant,
        ])
      ) {
        parties.push({ civilClaimantId: civilClaimant.id })
      }
    }

    return parties
  }

  // Writes appeal event-log rows with an actor snapshot of who performed the
  // event. Defenders are not system users, so userId is null and
  // national_id/name identify them (plus the defence party); for
  // prosecution/court users the system user id is stored. A defence user who
  // represents several parties gets one row per party. Shared by
  // registerAppellant and createEventLog.
  private async writeEventLog(
    theCase: Case,
    appealCase: AppealCase,
    eventType: AppealEventType,
    user: User,
    transaction: Transaction,
  ): Promise<void> {
    const parties = isDefenceUser(user)
      ? this.resolveDefenceParties(theCase, user)
      : []
    // Prosecution and request-case collective defence carry no party, but still
    // get a single event row.
    const partyRows = parties.length > 0 ? parties : [{}]

    await this.writeEventLogRows(
      theCase,
      appealCase,
      eventType,
      user,
      partyRows,
      transaction,
    )
  }

  // Writes one appeal event-log row per given party. Callers decide which
  // parties an event applies to: writeEventLog to every party the user
  // represents (an appeal / statement covers all of them), the withdrawal flow
  // to only the parties actually being withdrawn.
  private async writeEventLogRows(
    theCase: Case,
    appealCase: AppealCase,
    eventType: AppealEventType,
    user: User,
    partyRows: { defendantId?: string; civilClaimantId?: string }[],
    transaction: Transaction,
  ): Promise<void> {
    const isDefence = isDefenceUser(user)

    await Promise.all(
      partyRows.map((party) =>
        this.appealEventLogRepositoryService.create(
          {
            caseId: theCase.id,
            appealCaseId: appealCase.id,
            eventType,
            userRole: user.role,
            userId: isDefence ? undefined : user.id,
            ...party,
            nationalId: user.nationalId,
            userName: user.name,
            userTitle: user.title,
            institutionName: user.institution?.name,
          },
          { transaction },
        ),
      ),
    )
  }

  // True iff the user's party recorded an in-court ACCEPT ("unir úrskurðinum")
  // for this ruling order. Such a party has waived its right to appeal it, so an
  // out-of-court appeal from it must be rejected.
  private hasAcceptedRulingOrderInCourt(
    theCase: Case,
    rulingFileId: string,
    user: User,
  ): boolean {
    return (
      findUserRulingOrderAppealDecision(theCase, rulingFileId, user)
        ?.decision === CaseAppealDecision.ACCEPT
    )
  }

  // Records an APPEALED event for an out-of-court appeal - the appellant source
  // now that the legacy postponed-date / appealed-by columns are gone. In-court
  // appeals are recorded by the appeal_decision rows instead and never reach
  // here. Unlike createEventLog it dispatches no notification - the appeal
  // notification is queued separately by the caller
  // (addMessagesFor[RulingOrder]AppealedCaseToQueue).
  private registerAppellant(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
    transaction: Transaction,
  ): Promise<void> {
    return this.writeEventLog(
      theCase,
      appealCase,
      AppealEventType.APPEALED,
      user,
      transaction,
    )
  }

  private allAppealRolesAssigned(appealRoles: {
    appealAssistantId?: string
    appealJudge1Id?: string
    appealJudge2Id?: string
    appealJudge3Id?: string
  }): boolean {
    return Boolean(
      appealRoles.appealAssistantId &&
        appealRoles.appealJudge1Id &&
        appealRoles.appealJudge2Id &&
        appealRoles.appealJudge3Id,
    )
  }

  private addMessagesForAppealedCaseToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
    fileCategories: CaseFileCategory[],
  ): void {
    // If case was appealed in court we don't need to send these messages. The
    // in-court stance is on the case-level appeal_decision rows (ruling_file_id
    // null) now that the accused/prosecutor appeal decision columns are gone.
    const appealedInCourt = theCase.appealDecisions?.some(
      (decision) =>
        !decision.rulingFileId &&
        decision.decision === CaseAppealDecision.APPEAL,
    )
    if (appealedInCourt) {
      return
    }

    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        !caseFile.rulingFileId &&
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.isKeyAccessible &&
        caseFile.category &&
        fileCategories.includes(caseFile.category)
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: { type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
    })
  }

  private addMessagesForRulingOrderAppealedCaseToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    let fileCategories: CaseFileCategory[]

    if (isProsecutionUser(user)) {
      fileCategories = [
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
      ]
    } else if (isDefenceUser(user)) {
      fileCategories = [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
      ]
    } else {
      // Should never happen
      fileCategories = []
    }

    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        appealCase.rulingFileId === caseFile.rulingFileId &&
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.isKeyAccessible &&
        caseFile.category &&
        fileCategories.includes(caseFile.category)
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: { type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
    })
  }

  private addMessagesForReceivedAppealCaseToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: { type: AppealCaseNotificationType.APPEAL_RECEIVED_BY_COURT },
    })
  }

  private addMessagesForCompletedAppealCaseToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        appealCase.rulingFileId === caseFile.rulingFileId &&
        caseFile.state === CaseFileState.STORED_IN_RVG &&
        caseFile.isKeyAccessible &&
        caseFile.category &&
        caseFile.category === CaseFileCategory.APPEAL_RULING
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: caseFile.id,
        })
      }
    }

    addMessagesToQueue(
      {
        type: MessageType.APPEAL_CASE_NOTIFICATION,
        user,
        caseId: theCase.id,
        elementId: appealCase.id,
        body: { type: AppealCaseNotificationType.APPEAL_COMPLETED },
      },
      {
        type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION,
        user,
        caseId: theCase.id,
        elementId: appealCase.id,
      },
    )

    if (theCase.origin === CaseOrigin.LOKE) {
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_POLICE_APPEAL,
        user,
        caseId: theCase.id,
        elementId: appealCase.id,
      })
    }
  }

  private addMessagesForAppealStatementToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: { type: AppealCaseNotificationType.APPEAL_STATEMENT },
    })
  }

  private addMessagesForAppealWithdrawnToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
    })
  }

  private addMessagesForNewAppealCaseNumberToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    for (const caseFile of theCase.caseFiles ?? []) {
      if (
        caseFile.isKeyAccessible &&
        caseFile.category &&
        [
          CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
          CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
          CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        ].includes(caseFile.category)
      ) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          user,
          caseId: theCase.id,
          elementId: [appealCase.id, caseFile.id],
        })
      }
    }

    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
    })

    if (this.allAppealRolesAssigned(appealCase)) {
      this.addMessagesForAssignedAppealRolesToQueue(theCase, appealCase, user)
    }
  }

  private addMessagesForAssignedAppealRolesToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
    })
  }

  // The ids of the appeal roles (assistant + judges) currently assigned.
  private getAssignedAppealUserIds(appealRoles: {
    appealAssistantId?: string
    appealJudge1Id?: string
    appealJudge2Id?: string
    appealJudge3Id?: string
  }): string[] {
    return [
      appealRoles.appealAssistantId,
      appealRoles.appealJudge1Id,
      appealRoles.appealJudge2Id,
      appealRoles.appealJudge3Id,
    ].filter((id): id is string => Boolean(id))
  }

  private addMessagesForAppealJudgesAssignedToQueue(
    theCase: Case,
    appealCase: AppealCase,
    user: User,
    userIds: string[],
  ): void {
    addMessagesToQueue({
      type: MessageType.APPEAL_CASE_NOTIFICATION,
      user,
      caseId: theCase.id,
      elementId: appealCase.id,
      body: {
        type: AppealCaseNotificationType.APPEAL_JUDGES_ASSIGNED,
        userIds,
      },
    })
  }

  async create(
    theCase: Case,
    user: User,
    rulingFileId: string | undefined,
    transaction: Transaction,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating appeal case for case ${theCase.id}`)

    if (rulingFileId) {
      return this.createRulingOrderAppeal(
        theCase,
        user,
        rulingFileId,
        transaction,
      )
    }

    if (
      isIndictmentCase(theCase.type) &&
      theCase.indictmentRulingDecision !==
        CaseIndictmentRulingDecision.DISMISSAL
    ) {
      throw new ForbiddenException(
        'Only dismissed indictment cases can be appealed',
      )
    }

    const appealCaseData: UpdateAppealCase = {
      appealState: AppealCaseState.APPEALED,
      // An appeal filed out-of-court happens now - in-court appeals get
      // the ruling date instead (see case.service update on completion)
      appealDate: nowFactory(),
    }

    let fileCategories: CaseFileCategory[]

    if (isProsecutionUser(user)) {
      fileCategories = [
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
        CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
      ]
    } else if (isDefenceUser(user)) {
      fileCategories = [
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
        CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
      ]
    } else {
      throw new ForbiddenException(
        `Current user cannot appeal a ${theCase.type} case`,
      )
    }

    const appealCase = await this.appealCaseRepositoryService.create(
      theCase.id,
      appealCaseData,
      { transaction },
    )

    await this.registerAppellant(theCase, appealCase, user, transaction)

    this.addMessagesForAppealedCaseToQueue(
      theCase,
      appealCase,
      user,
      fileCategories,
    )

    return appealCase
  }

  private async createRulingOrderAppeal(
    theCase: Case,
    user: User,
    rulingFileId: string,
    transaction: Transaction,
  ): Promise<AppealCase> {
    if (!isIndictmentCase(theCase.type)) {
      throw new ForbiddenException(
        'Only indictment cases support ruling-order appeals',
      )
    }

    if (isCompletedCase(theCase.state)) {
      throw new ForbiddenException(
        'Ruling orders cannot be appealed after the case has completed',
      )
    }

    const caseFile = theCase.caseFiles?.find((f) => f.id === rulingFileId)

    if (!caseFile) {
      throw new NotFoundException(
        `Case file ${rulingFileId} of case ${theCase.id} does not exist`,
      )
    }

    if (caseFile.category !== CaseFileCategory.COURT_INDICTMENT_RULING_ORDER) {
      throw new BadRequestException(
        'The selected file is not a court indictment ruling order',
      )
    }

    if (!isProsecutionUser(user) && !isDefenceUser(user)) {
      throw new ForbiddenException(
        `Current user cannot appeal a ruling order on a ${theCase.type} case`,
      )
    }

    if (this.hasAcceptedRulingOrderInCourt(theCase, rulingFileId, user)) {
      throw new ForbiddenException(
        'A party that accepted the ruling order in court cannot appeal it',
      )
    }

    const appealCaseData: UpdateAppealCase = {
      appealState: AppealCaseState.APPEALED,
      rulingFileId,
      // An appeal filed out-of-court happens now - in-court appeals get
      // the court session end time instead
      appealDate: nowFactory(),
    }

    const appealCase = await this.appealCaseRepositoryService.create(
      theCase.id,
      appealCaseData,
      {
        transaction,
      },
    )

    await this.registerAppellant(theCase, appealCase, user, transaction)

    this.addMessagesForRulingOrderAppealedCaseToQueue(theCase, appealCase, user)

    return appealCase
  }

  async update(
    theCase: Case,
    appealCase: AppealCase,
    update: UpdateAppealCaseDto,
    user: User,
    transaction: Transaction,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Updating appeal case ${appealCase.id} of case ${theCase.id}`,
    )

    const data: UpdateAppealCase = { ...update }

    if (update.appealRulingModifiedHistory) {
      const existingHistory = appealCase.appealRulingModifiedHistory
        ? `${appealCase.appealRulingModifiedHistory}\n\n`
        : ''
      const today = capitalize(formatDate(nowFactory(), 'PPPPp'))
      data.appealRulingModifiedHistory = `${existingHistory}${today} - ${user.name} ${user.title}\n\n${update.appealRulingModifiedHistory}`
    }

    const updatedAppealCase = await this.appealCaseRepositoryService.update(
      appealCase.id,
      data,
      { transaction },
    )

    if (
      update.appealCaseNumber &&
      update.appealCaseNumber !== appealCase.appealCaseNumber
    ) {
      // Queue messages for new appeal case number
      this.addMessagesForNewAppealCaseNumberToQueue(theCase, appealCase, user)
    } else if (
      appealCase.appealCaseNumber &&
      this.allAppealRolesAssigned({
        appealAssistantId:
          update.appealAssistantId ?? appealCase.appealAssistantId,
        appealJudge1Id: update.appealJudge1Id ?? appealCase.appealJudge1Id,
        appealJudge2Id: update.appealJudge2Id ?? appealCase.appealJudge2Id,
        appealJudge3Id: update.appealJudge3Id ?? appealCase.appealJudge3Id,
      }) &&
      ((update.appealAssistantId &&
        update.appealAssistantId !== appealCase.appealAssistantId) ||
        (update.appealJudge1Id &&
          update.appealJudge1Id !== appealCase.appealJudge1Id) ||
        (update.appealJudge2Id &&
          update.appealJudge2Id !== appealCase.appealJudge2Id) ||
        (update.appealJudge3Id &&
          update.appealJudge3Id !== appealCase.appealJudge3Id))
    ) {
      // Queue messages for assigned roles
      this.addMessagesForAssignedAppealRolesToQueue(theCase, appealCase, user)
    }

    // Notify any users that are newly assigned to an appeal role, i.e. users
    // that were not already assigned to one of the roles before this update.
    const previouslyAssignedUserIds = this.getAssignedAppealUserIds(appealCase)
    const newlyAssignedUserIds = [
      ...new Set(
        this.getAssignedAppealUserIds({
          appealAssistantId:
            update.appealAssistantId ?? appealCase.appealAssistantId,
          appealJudge1Id: update.appealJudge1Id ?? appealCase.appealJudge1Id,
          appealJudge2Id: update.appealJudge2Id ?? appealCase.appealJudge2Id,
          appealJudge3Id: update.appealJudge3Id ?? appealCase.appealJudge3Id,
        }).filter((id) => !previouslyAssignedUserIds.includes(id)),
      ),
    ]

    if (newlyAssignedUserIds.length > 0) {
      this.addMessagesForAppealJudgesAssignedToQueue(
        theCase,
        appealCase,
        user,
        newlyAssignedUserIds,
      )
    }

    return updatedAppealCase
  }

  async createEventLog(
    theCase: Case,
    appealCase: AppealCase,
    eventType: AppealEventType,
    user: User,
    transaction: Transaction,
  ): Promise<AppealCase> {
    this.logger.debug(
      `Recording appeal event ${eventType} for appeal case ${appealCase.id} of case ${theCase.id}`,
    )

    await this.writeEventLog(theCase, appealCase, eventType, user, transaction)

    this.dispatchEventNotifications(eventType, theCase, appealCase, user)

    return appealCase
  }

  // Side-effect dispatch keyed on eventType — mirror EventLogService's
  // eventToNotificationMap pattern.
  private dispatchEventNotifications(
    eventType: AppealEventType,
    theCase: Case,
    appealCase: AppealCase,
    user: User,
  ): void {
    switch (eventType) {
      case AppealEventType.APPEAL_STATEMENT_SENT:
        this.addMessagesForAppealStatementToQueue(theCase, appealCase, user)
        break
    }
  }

  async transition(
    theCase: Case,
    appealCase: AppealCase,
    transition: AppealCaseTransition,
    user: User,
    transaction: Transaction,
  ): Promise<AppealTransitionResult & { appealCase: AppealCase }> {
    // Withdrawing an in-court ruling-order appeal is per party: only the
    // withdrawing party's decision is marked, and the appeal case is not
    // withdrawn until every appealing party has withdrawn.
    if (
      transition === AppealCaseTransition.WITHDRAW_APPEAL &&
      appealCase.rulingFileId &&
      isInCourtRulingOrderAppeal(theCase, appealCase.rulingFileId)
    ) {
      return this.withdrawInCourtRulingOrderAppeal(
        theCase,
        appealCase,
        appealCase.rulingFileId,
        user,
        transaction,
      )
    }

    return this.applyTransition(
      theCase,
      appealCase,
      transition,
      user,
      transaction,
    )
  }

  // A defence user withdraws its in-court ruling-order appeal. Just as an appeal
  // is made for every party the lawyer represents, withdrawal covers all of them
  // at once: every represented party with a standing (APPEAL, not yet withdrawn)
  // decision for this ruling is withdrawn together. Each such decision row is
  // stamped with the server's withdrawal time (never the client's) and an
  // APPEAL_WITHDRAWN event records who did it, per withdrawn party. The appeal
  // stands - and no party is notified - until every appealing party has
  // withdrawn, at which point the appeal case itself is withdrawn (the existing
  // WITHDRAW_APPEAL transition).
  private async withdrawInCourtRulingOrderAppeal(
    theCase: Case,
    appealCase: AppealCase,
    rulingFileId: string,
    user: User,
    transaction: Transaction,
  ): Promise<AppealTransitionResult & { appealCase: AppealCase }> {
    const withdrawable = userRulingOrderAppealDecisions(
      theCase,
      rulingFileId,
      user,
    ).filter(
      (decision) =>
        decision.decision === CaseAppealDecision.APPEAL &&
        !decision.withdrawnDate,
    )

    if (withdrawable.length === 0) {
      throw new ForbiddenException(
        'Only a party that appealed this ruling in court and has not already withdrawn can withdraw the appeal',
      )
    }

    // Serialize concurrent withdrawals for this ruling. Two parties withdrawing
    // at once would otherwise each stamp only their own row and, under READ
    // COMMITTED, read a set that still shows the other party as not-withdrawn -
    // so both skip WITHDRAW_APPEAL and the appeal stands even though everyone
    // has withdrawn. Locking every party's row up front (in a consistent order,
    // before we write our own) forces the second transaction to block here and
    // then re-read the freshly committed set. The lock must precede the update:
    // taking it after would let each transaction hold a lock on its own updated
    // row and deadlock on the other's.
    await this.appealDecisionRepositoryService.findAll({
      where: { caseId: theCase.id, rulingFileId },
      order: [['id', 'ASC']],
      lock: Transaction.LOCK.UPDATE,
      transaction,
    })

    const withdrawnDate = nowFactory()

    await Promise.all(
      withdrawable.map((decision) =>
        this.appealDecisionRepositoryService.update(
          decision.id,
          { withdrawnDate },
          { transaction },
        ),
      ),
    )

    // One APPEAL_WITHDRAWN event per party actually withdrawn - not per party the
    // user represents, since a represented party that accepted in court has no
    // appeal to withdraw.
    await this.writeEventLogRows(
      theCase,
      appealCase,
      AppealEventType.APPEAL_WITHDRAWN,
      user,
      withdrawable.map((decision) => ({
        defendantId: decision.defendantId ?? undefined,
        civilClaimantId: decision.civilClaimantId ?? undefined,
      })),
      transaction,
    )

    // The appeal stands until every party that appealed in court has withdrawn.
    const appealDecisions = await this.appealDecisionRepositoryService.findAll({
      where: { caseId: theCase.id, rulingFileId },
      transaction,
    })
    const allWithdrawn = appealDecisions
      .filter((d) => d.decision === CaseAppealDecision.APPEAL)
      .every((d) => d.withdrawnDate)

    if (allWithdrawn) {
      return this.applyTransition(
        theCase,
        appealCase,
        AppealCaseTransition.WITHDRAW_APPEAL,
        user,
        transaction,
      )
    }

    // No state change and no notification - the appeal still stands.
    return { caseUpdate: {}, appealCaseUpdate: {}, appealCase }
  }

  private async applyTransition(
    theCase: Case,
    appealCase: AppealCase,
    transition: AppealCaseTransition,
    user: User,
    transaction: Transaction,
  ): Promise<AppealTransitionResult & { appealCase: AppealCase }> {
    this.logger.debug(
      `Transitioning appeal case ${appealCase.id} of case ${theCase.id} with ${transition}`,
    )

    const result = transitionAppealCase(transition, theCase, appealCase)

    const updatedAppealCase = await this.appealCaseRepositoryService.update(
      appealCase.id,
      result.appealCaseUpdate,
      { transaction },
    )

    if (Object.keys(result.caseUpdate).length > 0) {
      await this.caseRepositoryService.update(theCase.id, result.caseUpdate, {
        transaction,
      })
    }

    // Queue messages based on new appeal state. This applies to all appeal
    // cases, including ruling-order appeals.
    const newAppealState = result.appealCaseUpdate.appealState
    const oldAppealState = appealCase.appealState

    if (newAppealState === AppealCaseState.RECEIVED) {
      // Only send received messages when transitioning from APPEALED (not when reopening)
      if (oldAppealState === AppealCaseState.APPEALED) {
        this.addMessagesForReceivedAppealCaseToQueue(theCase, appealCase, user)
      }
    } else if (newAppealState === AppealCaseState.COMPLETED) {
      this.addMessagesForCompletedAppealCaseToQueue(theCase, appealCase, user)
    } else if (newAppealState === AppealCaseState.WITHDRAWN) {
      this.addMessagesForAppealWithdrawnToQueue(theCase, appealCase, user)
    }

    return { ...result, appealCase: updatedAppealCase }
  }
}
