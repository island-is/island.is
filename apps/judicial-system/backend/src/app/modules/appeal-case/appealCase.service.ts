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
  AppealCaseType,
  AppealEventType,
  AppealOrigin,
  canDefendantAppealVerdict,
  CaseAppealDecision,
  CaseFileCategory,
  CaseFileState,
  CaseIndictmentRulingDecision,
  CaseOrigin,
  isCompletedCase,
  isDefenceUser,
  isIndictmentCase,
  isProsecutionUser,
  isPublicProsecutionOfficeUser,
  isPublicProsecutionUser,
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
  CreateAppealCase,
  Defendant,
  DefendantRepositoryService,
  UpdateAppealCase,
  UpdateDefendant,
  VerdictRepositoryService,
} from '../repository'
import { getLatestVerdict } from '../verdict/getLatestVerdict'
import { validateVerdictAppealUpdate } from '../verdict/verdict.helpers'
import { CreateAppealCaseDto } from './dto/createAppealCase.dto'
import { UpdateAppealCaseDto } from './dto/updateAppealCase.dto'
import {
  AppealTransitionResult,
  transitionAppealCase,
} from './state/appealCase.state'
import { appealCaseModuleConfig } from './appealCase.config'
import {
  findUserRulingOrderAppealDecision,
  hasStandingVerdictAppeal,
  isInCourtRulingOrderAppeal,
  standingVerdictAppellants,
  userRulingOrderAppealDecisions,
  type VerdictAppellantSide,
} from './appealCase.helpers'

// What a verdict appeal is filed with, beyond the case and the user. A defender
// appealing in the system supplies the defendant only; the public prosecution
// office registering an appeal that arrived by letter or email also supplies
// when it was filed and by which defender.
export type VerdictAppealRequest = Pick<
  CreateAppealCaseDto,
  | 'defendantId'
  | 'appealDate'
  | 'appealDefenderName'
  | 'appealDefenderNationalId'
  | 'appealDefenderEmail'
  | 'appealDefenderPhoneNumber'
>

@Injectable()
export class AppealCaseService {
  constructor(
    private readonly appealCaseRepositoryService: AppealCaseRepositoryService,
    @Inject(forwardRef(() => CaseRepositoryService))
    private readonly caseRepositoryService: CaseRepositoryService,
    private readonly appealEventLogRepositoryService: AppealEventLogRepositoryService,
    private readonly appealDecisionRepositoryService: AppealDecisionRepositoryService,
    private readonly verdictRepositoryService: VerdictRepositoryService,
    private readonly defendantRepositoryService: DefendantRepositoryService,
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
            // Everything written here is a party acting outside the court
            // record; in-court APPEALED events are built by
            // buildInCourtAppealedEvent instead. Origin is only meaningful for
            // APPEALED.
            appealOrigin:
              eventType === AppealEventType.APPEALED
                ? AppealOrigin.OUT_OF_COURT
                : undefined,
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
    verdictAppeal?: VerdictAppealRequest,
  ): Promise<AppealCase> {
    this.logger.debug(`Creating appeal case for case ${theCase.id}`)

    if (verdictAppeal) {
      return this.createVerdictAppeal(theCase, user, verdictAppeal, transaction)
    }

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

    const appealCaseData: CreateAppealCase = {
      appealType: AppealCaseType.RULING,
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

    const appealCaseData: CreateAppealCase = {
      appealType: AppealCaseType.RULING,
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

  // Who is filing a verdict appeal, and for which side. The defendant's
  // confirmed defender and the public prosecution office both file the
  // defendant's appeal - the office on a letter that reached it outside the
  // system - while the public prosecution reviewer files the prosecution's
  // appeal of the verdict regarding that defendant. Each is per defendant.
  private verdictAppealActor(
    user: User,
  ):
    | { actor: 'DEFENDER' | 'OFFICE'; side: 'DEFENCE' }
    | { actor: 'REVIEWER'; side: 'PROSECUTION' } {
    if (isDefenceUser(user)) {
      return { actor: 'DEFENDER', side: 'DEFENCE' }
    }

    if (isPublicProsecutionOfficeUser(user)) {
      return { actor: 'OFFICE', side: 'DEFENCE' }
    }

    if (isPublicProsecutionUser(user)) {
      return { actor: 'REVIEWER', side: 'PROSECUTION' }
    }

    throw new ForbiddenException(
      'Only a defence user, the public prosecution office or the public prosecution can appeal a verdict',
    )
  }

  // A verdict appeal is filed for one specific defendant rather than every
  // party the lawyer represents - the action lives on that defendant's card,
  // and two defendants of the same defender can appeal on different days or
  // not at all - so resolveDefenceParties is deliberately not used.
  //
  // Three ways in. The defendant's confirmed defender appeals in the system:
  // the legal act itself, so every condition is checked hard. The public
  // prosecution office registers an appeal that reached it outside the system
  // (a letter, typically from a new defender): it acts for the defendant, so it
  // is not held to being their defender, and it records an act that already
  // happened, so the appeal date is the filing's and the deadline is not
  // enforced. The public prosecution reviewer appeals the verdict regarding a
  // defendant on the prosecution's behalf: the decision confirmed on the
  // review page is the appeal, the deadline is theirs to judge (confirmed on
  // that page), and nothing about the defendant's own appeal - the service
  // state, the mirror on the verdict, the appeal defender - applies.
  private async createVerdictAppeal(
    theCase: Case,
    user: User,
    request: VerdictAppealRequest,
    transaction: Transaction,
  ): Promise<AppealCase> {
    const { actor, side } = this.verdictAppealActor(user)
    const isRegisteredByProsecutionOffice = actor === 'OFFICE'
    const isProsecutionAppeal = actor === 'REVIEWER'

    if (isProsecutionAppeal && theCase.indictmentReviewerId !== user.id) {
      throw new ForbiddenException(
        'Only the reviewer assigned to the case can appeal a verdict for the prosecution',
      )
    }

    const { defendantId } = request

    if (!defendantId) {
      throw new BadRequestException(
        'A verdict appeal must name the defendant it is filed for',
      )
    }

    const defendant = theCase.defendants?.find((d) => d.id === defendantId)

    if (!defendant) {
      throw new NotFoundException(
        `Defendant ${defendantId} of case ${theCase.id} does not exist`,
      )
    }

    if (
      actor === 'DEFENDER' &&
      !Defendant.isConfirmedDefenderOfDefendant(user.nationalId, [defendant])
    ) {
      throw new ForbiddenException(
        `Current user is not the confirmed defender of defendant ${defendantId}`,
      )
    }

    if (
      !isIndictmentCase(theCase.type) ||
      !isCompletedCase(theCase.state) ||
      theCase.indictmentRulingDecision !== CaseIndictmentRulingDecision.RULING
    ) {
      throw new ForbiddenException(
        'Only a completed indictment case that ended in a verdict can be appealed',
      )
    }

    // Prefer the newest verdict when a corrected ruling created a replacement.
    const verdict = getLatestVerdict(defendant.verdicts)

    if (!verdict) {
      throw new ForbiddenException(
        `Defendant ${defendantId} has no verdict to appeal`,
      )
    }

    // The defendant's appeal covers the útivistardómur (reopened rather than
    // appealed) and the service state: the defendant must have been made aware
    // of the verdict. The prosecution's right to appeal depends on neither.
    if (!isProsecutionAppeal && !canDefendantAppealVerdict(verdict)) {
      throw new ForbiddenException(
        `The verdict of defendant ${defendantId} cannot be appealed`,
      )
    }

    // The deadline is hard for a defender appealing in the system: the filing
    // is the legal act. The public prosecution office registers an appeal that
    // already happened, possibly after the deadline - late bookkeeping of a
    // timely appeal, or a genuinely late one - and its screen confirms the
    // latter with the user, the same way its appeal date picker did before. The
    // reviewer's deadline runs from the ruling date and the review page
    // confirms a late decision the same way.
    if (actor === 'DEFENDER') {
      validateVerdictAppealUpdate({
        caseId: theCase.id,
        indictmentRulingDecision: theCase.indictmentRulingDecision,
        rulingDate: theCase.rulingDate,
        verdict,
      })
    }

    // verdict.appealDate mirrors the defendant's own appeal only.
    if (side === 'DEFENCE' && verdict.appealDate) {
      throw new ForbiddenException(
        `The verdict of defendant ${defendantId} has already been appealed`,
      )
    }

    const appealedAt = isRegisteredByProsecutionOffice
      ? this.registeredVerdictAppealDate(request.appealDate)
      : nowFactory()

    // One Landsréttur case per district court case, whoever the appellants are:
    // the first defendant to appeal creates it and later ones join it, each
    // adding their own APPEALED event and their own declaration files.
    //
    // Locking the case row first is what makes that safe. Two defenders filing
    // at once would otherwise both find no appeal case and both create one;
    // under READ COMMITTED neither sees the other's uncommitted row. The second
    // transaction blocks here instead, and then reads the row the first
    // committed. The unique index on (case_id, ruling_file_id) - NULLS NOT
    // DISTINCT, so it holds for the null ruling file of a case-level appeal - is
    // the backstop, not the mechanism: it would turn the race into a failed
    // appeal rather than a joined one.
    await this.caseRepositoryService.lockByIdForUpdate(theCase.id, transaction)

    const [existingAppealCase] = await this.appealCaseRepositoryService.findAll(
      {
        where: { caseId: theCase.id, appealType: AppealCaseType.VERDICT },
        transaction,
      },
    )

    // The appealDate check above reads the case as it was loaded before the
    // transaction, so it cannot see an appeal filed in the meantime - two
    // requests for the same defendant, a double-clicked filing being the easy
    // way there, would both pass it. This is the same question asked again under
    // the lock, against what the appeal case actually records - and for the
    // prosecution, which has no mirror, it is the only check.
    if (existingAppealCase) {
      // Once the court of appeals has received the case the prosecution's
      // decision is made; a late change is not a matter for this system.
      if (
        isProsecutionAppeal &&
        existingAppealCase.appealState !== AppealCaseState.APPEALED &&
        existingAppealCase.appealState !== AppealCaseState.WITHDRAWN
      ) {
        throw new ForbiddenException(
          'The verdict appeal has been received by the court of appeals',
        )
      }

      const appealEventLogs =
        await this.appealEventLogRepositoryService.findAll({
          where: { appealCaseId: existingAppealCase.id },
          transaction,
        })

      if (hasStandingVerdictAppeal({ appealEventLogs }, defendantId, side)) {
        throw new ForbiddenException(
          `The verdict of defendant ${defendantId} has already been appealed`,
        )
      }
    }

    let appealCase =
      existingAppealCase ??
      (await this.appealCaseRepositoryService.create(
        theCase.id,
        {
          appealType: AppealCaseType.VERDICT,
          appealState: AppealCaseState.APPEALED,
          appealDate: appealedAt,
        },
        { transaction },
      ))

    // A defendant may appeal again within the deadline after every appellant had
    // withdrawn, which left this shared appeal case WITHDRAWN. It is the same
    // Landsréttur case coming back to life rather than a new one, so it returns
    // to APPEALED - otherwise it would stand withdrawn while carrying a standing
    // appellant. Only from WITHDRAWN: once Landsréttur has received the appeal a
    // late appellant is its own problem, and must not reset the state under it.
    if (existingAppealCase?.appealState === AppealCaseState.WITHDRAWN) {
      appealCase = await this.appealCaseRepositoryService.update(
        existingAppealCase.id,
        {
          appealState: AppealCaseState.APPEALED,
          appealDate: appealedAt,
        },
        { transaction },
      )
    }

    await this.writeEventLogRows(
      theCase,
      appealCase,
      AppealEventType.APPEALED,
      user,
      [{ defendantId }],
      transaction,
    )

    if (isRegisteredByProsecutionOffice) {
      await this.recordAppealDefender(
        theCase,
        defendantId,
        request,
        transaction,
      )
    }

    // AppealCase is the source of truth for who appealed; verdict.appealDate is
    // kept as a one-way mirror of the *defendant's* appeal so the public
    // prosecution office's existing screen keeps working untouched. It mirrors
    // when *this* defendant appealed, which is not the appeal case's own
    // appealDate for a defendant joining an appeal someone else filed - that
    // screen shows the date per defendant. The prosecution's appeal is read
    // from the event log alone.
    if (side === 'DEFENCE') {
      await this.verdictRepositoryService.update(
        theCase.id,
        defendantId,
        verdict.id,
        { appealDate: appealedAt },
        { transaction },
      )
    }

    // No notification: the one that tells the public prosecution office about a verdict appeal is
    // its own story, and the ruling appeal notifications do not apply here.

    return appealCase
  }

  // The date the public prosecution office registers is the one on the filing
  // it received, which cannot be in the future. Anything else about it - a
  // filing after the deadline in particular - is for the office to judge.
  //
  // The DTO declares a Date, but the validation pipe does not transform the
  // body, so what arrives is whatever the client sent - an ISO string from the
  // web. Read it as a date here rather than trust the declared type.
  private registeredVerdictAppealDate(
    appealDate: Date | string | undefined,
  ): Date {
    if (!appealDate) {
      throw new BadRequestException(
        'Registering a verdict appeal must state when it was filed',
      )
    }

    const date = new Date(appealDate)

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(
        `${appealDate} is not a date a verdict appeal can have been filed on`,
      )
    }

    if (date.getTime() > nowFactory().getTime()) {
      throw new BadRequestException(
        'A verdict appeal cannot have been filed in the future',
      )
    }

    return date
  }

  // Records which defender filed the appeal the public prosecution office is
  // registering. Information only - the defender of record is untouched and
  // nothing grants the appeal defender access; that follows once the court of
  // appeals confirms them.
  private async recordAppealDefender(
    theCase: Case,
    defendantId: string,
    request: VerdictAppealRequest,
    transaction: Transaction,
  ): Promise<void> {
    const supplied = [
      request.appealDefenderName,
      request.appealDefenderNationalId,
      request.appealDefenderEmail,
      request.appealDefenderPhoneNumber,
    ]

    if (supplied.every((value) => value === undefined)) {
      return
    }

    // The supplied fields describe one person, so the ones left out are
    // cleared rather than kept from whoever was recorded before - Sequelize
    // skips undefined, so the clearing has to be explicit. A new appeal
    // defender is also a new person for the court of appeals to confirm,
    // whatever it had decided about the previous one.
    const appealDefender: UpdateDefendant = {
      appealDefenderName: request.appealDefenderName ?? null,
      appealDefenderNationalId: request.appealDefenderNationalId ?? null,
      appealDefenderEmail: request.appealDefenderEmail ?? null,
      appealDefenderPhoneNumber: request.appealDefenderPhoneNumber ?? null,
      isAppealDefenderConfirmed: false,
    }

    await this.defendantRepositoryService.update(
      theCase.id,
      defendantId,
      appealDefender,
      { transaction },
    )
  }

  // The appeal defender belongs to the appeal: withdrawn, there is no appeal
  // for them to have filed, and a later registration that names nobody must
  // not show them again.
  private async clearAppealDefender(
    theCase: Case,
    defendantId: string,
    transaction: Transaction,
  ): Promise<void> {
    await this.defendantRepositoryService.update(
      theCase.id,
      defendantId,
      {
        appealDefenderName: null,
        appealDefenderNationalId: null,
        appealDefenderEmail: null,
        appealDefenderPhoneNumber: null,
        isAppealDefenderConfirmed: null,
      },
      { transaction },
    )
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
    defendantId?: string,
  ): Promise<AppealTransitionResult & { appealCase: AppealCase }> {
    // Withdrawing a verdict appeal is per defendant, the same way filing one is.
    if (
      transition === AppealCaseTransition.WITHDRAW_APPEAL &&
      appealCase.appealType === AppealCaseType.VERDICT
    ) {
      return this.withdrawVerdictAppeal(
        theCase,
        appealCase,
        defendantId,
        user,
        transaction,
      )
    }

    // Withdrawal is the only transition a verdict appeal supports so far. The
    // ones that carry a ruling appeal to and through the court of appeals were
    // written for that, and the court of appeals work has to take them on for
    // verdict appeals deliberately - until then they are refused rather than
    // applied to a case they were never checked against.
    if (appealCase.appealType === AppealCaseType.VERDICT) {
      throw new ForbiddenException(
        `Verdict appeals cannot be transitioned with ${transition} yet`,
      )
    }

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

  // A defence user withdraws the verdict appeal it filed for one of its defendants.
  // Only that defendant stops appealing: the appeal case stands until every
  // appellant has withdrawn, at which point it is withdrawn itself and the
  // notification goes out - the same shape as withdrawInCourtRulingOrderAppeal,
  // but keyed on the appeal event log rather than on appeal_decision rows, since
  // an out-of-court appellant has none.
  private async withdrawVerdictAppeal(
    theCase: Case,
    appealCase: AppealCase,
    defendantId: string | undefined,
    user: User,
    transaction: Transaction,
  ): Promise<AppealTransitionResult & { appealCase: AppealCase }> {
    // The same three actors as filing, each withdrawing their own side's appeal
    // for the defendant: the office on the defendant's behalf, so it is not held
    // to being their defender; the reviewer the prosecution's.
    const { actor, side } = this.verdictAppealActor(user)

    if (actor === 'REVIEWER') {
      if (theCase.indictmentReviewerId !== user.id) {
        throw new ForbiddenException(
          'Only the reviewer assigned to the case can withdraw a verdict appeal for the prosecution',
        )
      }

      if (appealCase.appealState !== AppealCaseState.APPEALED) {
        throw new ForbiddenException(
          'The verdict appeal has been received by the court of appeals',
        )
      }
    }

    if (!defendantId) {
      throw new BadRequestException(
        'Withdrawing a verdict appeal must name the defendant it is withdrawn for',
      )
    }

    const defendant = theCase.defendants?.find((d) => d.id === defendantId)

    if (!defendant) {
      throw new NotFoundException(
        `Defendant ${defendantId} of case ${theCase.id} does not exist`,
      )
    }

    if (
      actor === 'DEFENDER' &&
      !Defendant.isConfirmedDefenderOfDefendant(user.nationalId, [defendant])
    ) {
      throw new ForbiddenException(
        `Current user is not the confirmed defender of defendant ${defendantId}`,
      )
    }

    // Serialize concurrent withdrawals on this case, for the same reason the
    // in-court withdrawal serializes them: two defenders withdrawing at once
    // would each write only their own event and then read a set that still shows
    // the other as standing, so neither would withdraw the appeal case and it
    // would stand with no appellants left. The second transaction blocks here
    // and re-reads the freshly committed events.
    await this.caseRepositoryService.lockByIdForUpdate(theCase.id, transaction)

    const appealEventLogs = await this.appealEventLogRepositoryService.findAll({
      where: { appealCaseId: appealCase.id },
      transaction,
    })

    const standingAppellants = standingVerdictAppellants({ appealEventLogs })
    const isWithdrawn = (appellant: {
      defendantId: string
      side: VerdictAppellantSide
    }) => appellant.defendantId === defendantId && appellant.side === side

    if (!standingAppellants.some(isWithdrawn)) {
      throw new ForbiddenException(
        side === 'PROSECUTION'
          ? `The prosecution has no standing appeal of the verdict of defendant ${defendantId} to withdraw`
          : `Defendant ${defendantId} has no standing appeal of the verdict to withdraw`,
      )
    }

    await this.writeEventLogRows(
      theCase,
      appealCase,
      AppealEventType.APPEAL_WITHDRAWN,
      user,
      [{ defendantId }],
      transaction,
    )

    // The defendant's own appeal carries a mirror on the verdict and possibly an
    // appeal defender; the prosecution's carries neither.
    if (side === 'DEFENCE') {
      // Clear the mirror on the verdict, so the public prosecution office's
      // screen stops showing this defendant as having appealed.
      const verdict = getLatestVerdict(defendant.verdicts)

      if (verdict) {
        await this.verdictRepositoryService.update(
          theCase.id,
          defendantId,
          verdict.id,
          { appealDate: null },
          { transaction },
        )
      }

      await this.clearAppealDefender(theCase, defendantId, transaction)
    }

    // The appeal case stands while any appellant of either side stands.
    const remainingAppellants = standingAppellants.filter(
      (appellant) => !isWithdrawn(appellant),
    )

    if (remainingAppellants.length === 0) {
      return this.applyTransition(
        theCase,
        appealCase,
        AppealCaseTransition.WITHDRAW_APPEAL,
        user,
        transaction,
      )
    }

    // The appeal still stands for the other appellants - no state change and no
    // notification.
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
