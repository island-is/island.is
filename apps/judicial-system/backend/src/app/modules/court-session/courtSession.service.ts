import { Transaction } from 'sequelize'

import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  addMessagesToQueue,
  type Message,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealCaseTransition,
  AppealDecisionPartyRole,
  AppealEventType,
  CaseAppealDecision,
  CaseFileCategory,
  CourtSessionRulingType,
  EventType,
  IndictmentCaseNotificationType,
  type User as TUser,
} from '@island.is/judicial-system/types'

import {
  buildInCourtAppealedEvent,
  inCourtAppellantsFromDecisions,
} from '../appeal-case'
import { transitionAppealCase } from '../appeal-case'
import { EventLogService } from '../event-log'
import { FileService } from '../file'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealDecision,
  AppealDecisionRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CourtSession,
  CourtSessionRepositoryService,
  CourtSessionString,
  UpdateCourtSession,
} from '../repository'
import { CourtSessionAppealDecisionDto } from './dto/courtSessionAppealDecision.dto'
import { CourtSessionStringDto } from './dto/CourtSessionStringDto.dto'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'

// Appeal files parties upload for a ruling-order appeal (briefs, statements and
// their attachments). Deleted alongside the appeal case when an in-court appeal
// is corrected away. COA-produced files (court record, ruling) are excluded -
// they only exist once an appeal has progressed, which blocks the correction.
const APPEAL_PARTY_FILE_CATEGORIES = [
  CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
  CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
]

@Injectable()
export class CourtSessionService {
  constructor(
    private readonly courtSessionRepositoryService: CourtSessionRepositoryService,
    private readonly appealDecisionRepositoryService: AppealDecisionRepositoryService,
    private readonly appealCaseRepositoryService: AppealCaseRepositoryService,
    private readonly appealEventLogRepositoryService: AppealEventLogRepositoryService,
    private readonly fileService: FileService,
    private readonly eventLogService: EventLogService,
    // TODO: Move to a repository service - models should only be used in repository services
    // It would be best to hide the details of the court session model from all but the backend
    @InjectModel(CourtSessionString)
    private readonly courtSessionStringModel: typeof CourtSessionString,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private addMessagesForConfirmedCourtRecordToQueue(
    caseId: string,
    courtSession: CourtSession,
    user: TUser,
  ): void {
    const messages: Message[] = [
      {
        type: MessageType.DELIVERY_TO_COURT_COURT_RECORD_WORKING_DOCUMENT,
        user,
        caseId,
      },
    ]

    // When a ruling order uploaded during the course of a case is pronounced
    // in a confirmed court session, the parties are notified about the ruling.
    if (courtSession.rulingType === CourtSessionRulingType.ORDER) {
      messages.push({
        type: MessageType.NOTIFICATION,
        user,
        caseId,
        body: { type: IndictmentCaseNotificationType.RULING_ORDER_ADDED },
      })
    }

    addMessagesToQueue(...messages)
  }

  create(theCase: Case, transaction: Transaction): Promise<CourtSession> {
    return this.courtSessionRepositoryService.create(theCase.id, {
      transaction,
    })
  }

  async createOrUpdateCourtSessionString({
    caseId,
    courtSessionId,
    mergedCaseId,
    update,
    transaction,
  }: {
    caseId: string
    courtSessionId: string
    mergedCaseId?: string
    update: CourtSessionStringDto
    transaction?: Transaction
  }): Promise<CourtSessionString> {
    const courtSessionString = await this.courtSessionStringModel.findOne({
      where: {
        caseId,
        courtSessionId,
        mergedCaseId,
        stringType: update.stringType,
      },
      transaction,
    })
    if (courtSessionString) {
      const [numberOfAffectedRows, courtSessionString] =
        await this.courtSessionStringModel.update(
          { value: update.value },
          {
            where: {
              caseId,
              courtSessionId,
              mergedCaseId,
              stringType: update.stringType,
            },
            transaction,
            returning: true,
          },
        )
      if (numberOfAffectedRows < 1) {
        throw new InternalServerErrorException(
          `Could not update court session string for court session ${courtSessionId} of case ${caseId}`,
        )
      }

      if (numberOfAffectedRows > 1) {
        // Tolerate failure, but log error
        this.logger.error(
          `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court session string for court session ${courtSessionId} of case ${caseId} with data:`,
          { data: Object.keys({ value: update.value }) },
        )
      }

      this.logger.debug(
        `Updated court session string for court session ${courtSessionId} of case ${caseId}`,
      )
      return courtSessionString[0]
    } else {
      const courtSessionString = await this.courtSessionStringModel.create(
        {
          caseId,
          courtSessionId,
          mergedCaseId,
          stringType: update.stringType,
          value: update.value,
        },
        {
          transaction,
        },
      )
      return courtSessionString
    }
  }

  async update(
    theCase: Case,
    existingCourtSession: CourtSession,
    update: UpdateCourtSessionDto,
    user: TUser,
    transaction: Transaction,
  ): Promise<CourtSession> {
    const normalizedUpdate = await this.validateAndNormalizeRulingFile(
      theCase,
      existingCourtSession,
      update,
    )

    // Pre-check: confirming an ORDER session requires a decision from every
    // party. Runs before the session is written so confirmation is rejected
    // wholesale if any decision is missing.
    const becomingConfirmed =
      update.isConfirmed === true && existingCourtSession.isConfirmed !== true
    const effectiveRulingType =
      'rulingType' in update
        ? update.rulingType
        : existingCourtSession.rulingType
    const effectiveRulingFileId =
      'rulingFileId' in normalizedUpdate
        ? normalizedUpdate.rulingFileId
        : existingCourtSession.rulingFileId

    if (
      becomingConfirmed &&
      effectiveRulingType === CourtSessionRulingType.ORDER &&
      effectiveRulingFileId
    ) {
      await this.validateAppealDecisionsComplete(
        theCase,
        effectiveRulingFileId,
        transaction,
      )
      await this.validateAppealCorrectionAllowed(
        theCase,
        effectiveRulingFileId,
        transaction,
      )
    }

    // A correction can swap the ruling order file or move the session away from
    // ORDER. The previously pronounced ruling's in-court appeal is reconciled
    // separately from the new ruling's (see reconcileRulingLinkChange after the
    // write); both link changes need an up-front guard. A swap must target a
    // clean ruling file (re-keying onto one that already carries appeal data
    // would collide or merge two appeals); a removal must not orphan a progressed
    // appeal. Gated on the link change rather than on confirmation, because the
    // file can be swapped in a non-confirming correction save before the session
    // is re-confirmed.
    const previousRulingFileId = existingCourtSession.rulingFileId
    const rulingLinkChanged =
      !!previousRulingFileId && previousRulingFileId !== effectiveRulingFileId

    if (rulingLinkChanged) {
      if (effectiveRulingFileId) {
        await this.validateRulingSwapAllowed(
          theCase,
          effectiveRulingFileId,
          transaction,
        )
      } else {
        this.validateRulingRemovalAllowed(theCase, previousRulingFileId)
      }
    }

    const updatedCourtSession = await this.courtSessionRepositoryService.update(
      theCase.id,
      existingCourtSession.id,
      normalizedUpdate,
      { transaction },
    )

    if (!existingCourtSession.isConfirmed && updatedCourtSession.isConfirmed) {
      this.addMessagesForConfirmedCourtRecordToQueue(
        theCase.id,
        updatedCourtSession,
        user,
      )

      if (
        updatedCourtSession.rulingType === CourtSessionRulingType.ORDER &&
        updatedCourtSession.rulingFileId
      ) {
        await this.reconcileInCourtRulingOrderAppeal(
          theCase,
          updatedCourtSession,
          user,
          transaction,
        )
      }
    }

    if (rulingLinkChanged) {
      await this.reconcileRulingLinkChange(
        theCase,
        previousRulingFileId,
        effectiveRulingFileId ?? null,
        user,
        transaction,
      )
    }

    return updatedCourtSession
  }

  // Every party (each defendant, each civil claimant and the prosecution) must
  // have recorded a decision before an ORDER session can be confirmed.
  private async validateAppealDecisionsComplete(
    theCase: Case,
    rulingFileId: string,
    transaction: Transaction,
  ): Promise<void> {
    const decisions = await this.appealDecisionRepositoryService.findAll({
      where: { caseId: theCase.id, rulingFileId },
      transaction,
    })

    // TEMPORARY — REMOVE WHEN THE RULING-ORDER APPEAL UI IS DEPLOYED.
    // The court UI that records per-party "Ákvörðun um kæru" decisions is not in
    // production yet, so no ORDER session can have any decisions and this check
    // would block every ruling-order confirmation. While no decisions exist we
    // skip the completeness check, restoring pre-appeal confirmation behaviour.
    // Once the data-entry UI (in-court and out-of-court ruling-order appeals)
    // ships, DELETE this early return so confirming an ORDER session again
    // requires every party's decision — otherwise a session with no decisions
    // entered could be confirmed and silently bypass the requirement.
    if (decisions.length === 0) {
      return
    }

    const hasDecision = (
      predicate: (decision: AppealDecision) => boolean,
    ): boolean => decisions.some((d) => d.decision !== null && predicate(d))

    if (
      !hasDecision((d) => d.partyRole === AppealDecisionPartyRole.PROSECUTOR)
    ) {
      throw new BadRequestException(
        'The prosecution must take a position on the ruling before the court session can be confirmed',
      )
    }

    for (const defendant of theCase.defendants ?? []) {
      if (
        !hasDecision(
          (d) =>
            d.partyRole === AppealDecisionPartyRole.DEFENDANT &&
            d.defendantId === defendant.id,
        )
      ) {
        throw new BadRequestException(
          `Defendant ${defendant.id} must take a position on the ruling before the court session can be confirmed`,
        )
      }
    }

    for (const civilClaimant of theCase.civilClaimants ?? []) {
      if (
        !hasDecision(
          (d) =>
            d.partyRole === AppealDecisionPartyRole.CIVIL_CLAIMANT &&
            d.civilClaimantId === civilClaimant.id,
        )
      ) {
        throw new BadRequestException(
          `Civil claimant ${civilClaimant.id} must take a position on the ruling before the court session can be confirmed`,
        )
      }
    }
  }

  // Correcting a confirmed ruling order must not silently discard an appeal
  // that has already moved past the district court. If the corrected decisions
  // no longer contain an in-court appeal but the appeal case has progressed
  // beyond APPEALED, reject the confirmation. (A still-APPEALED appeal is
  // cleaned up by reconcileInCourtRulingOrderAppeal after the write.)
  private async validateAppealCorrectionAllowed(
    theCase: Case,
    rulingFileId: string,
    transaction: Transaction,
  ): Promise<void> {
    const existingAppealCase = theCase.rulingOrderAppealCases?.find(
      (appealCase) => appealCase.rulingFileId === rulingFileId,
    )
    if (
      !existingAppealCase ||
      existingAppealCase.appealState === AppealCaseState.APPEALED
    ) {
      return
    }

    const decisions = await this.appealDecisionRepositoryService.findAll({
      where: { caseId: theCase.id, rulingFileId },
      transaction,
    })
    const someoneAppealedInCourt = decisions.some(
      (d) => d.decision === CaseAppealDecision.APPEAL,
    )

    if (!someoneAppealedInCourt) {
      throw new BadRequestException(
        'The appeal of this ruling has progressed past the district court and cannot be removed by correcting the court record',
      )
    }
  }

  // The session's ruling is being removed (the ruling type moved away from
  // ORDER), so its in-court appeal cannot be carried onto a new file. An appeal
  // that has progressed past the district court must not be silently discarded,
  // so reject the change. A still-APPEALED appeal is cleaned up afterwards by
  // reconcileRulingLinkChange.
  private validateRulingRemovalAllowed(
    theCase: Case,
    rulingFileId: string | null,
  ): void {
    if (!rulingFileId) {
      return
    }

    const existingAppealCase = theCase.rulingOrderAppealCases?.find(
      (appealCase) => appealCase.rulingFileId === rulingFileId,
    )

    if (
      existingAppealCase &&
      existingAppealCase.appealState !== AppealCaseState.APPEALED
    ) {
      throw new BadRequestException(
        'The appeal of this ruling has progressed past the district court, so the ruling cannot be removed by correcting the court record',
      )
    }
  }

  // The session's ruling is being swapped onto a different file, which re-keys
  // this ruling's decisions, appeal case and appeal party files onto it
  // (reconcileRulingLinkChange). The file selector only validates existence and
  // category, so the target could already be another session's appealed ruling.
  // Re-keying onto it would violate the (case, ruling file) unique indexes or
  // merge two separate appeals, so reject up front if the target already carries
  // an appeal case or any recorded decisions.
  private async validateRulingSwapAllowed(
    theCase: Case,
    nextRulingFileId: string,
    transaction: Transaction,
  ): Promise<void> {
    const targetAppealCase = theCase.rulingOrderAppealCases?.find(
      (appealCase) => appealCase.rulingFileId === nextRulingFileId,
    )

    if (targetAppealCase) {
      throw new BadRequestException(
        'The selected ruling file is already linked to another appeal',
      )
    }

    const targetDecisions = await this.appealDecisionRepositoryService.findAll({
      where: { caseId: theCase.id, rulingFileId: nextRulingFileId },
      transaction,
    })

    if (targetDecisions.length > 0) {
      throw new BadRequestException(
        'The selected ruling file already has recorded appeal decisions',
      )
    }
  }

  // Converges the appeal case's APPEALED events with the parties that appealed
  // this ruling in court. An APPEALED event records a real fact - the party
  // appealed - so it is kept even after the party withdraws (the withdrawal is a
  // new decision, recorded by an APPEAL_WITHDRAWN event). It is removed only when
  // the decision is no longer APPEAL - i.e. a court employee corrected an
  // erroneous entry, so the appeal never happened. Adds an event for each
  // standing appellant that has none yet. Idempotent.
  private async reconcileInCourtAppealedEvents(
    theCase: Case,
    appealCase: AppealCase,
    appeals: AppealDecision[],
    actor: TUser,
    transaction: Transaction,
  ): Promise<void> {
    const appellants = inCourtAppellantsFromDecisions(appeals)

    const existingEvents = await this.appealEventLogRepositoryService.findAll({
      where: {
        appealCaseId: appealCase.id,
        eventType: AppealEventType.APPEALED,
      },
      transaction,
    })

    // A party's stable identity within a ruling's appeal - the defence party id,
    // or the prosecution, which has no party id.
    const partyKey = (party: {
      defendantId?: string | null
      civilClaimantId?: string | null
    }): string => party.defendantId ?? party.civilClaimantId ?? 'PROSECUTOR'

    const existingKeys = new Set(existingEvents.map(partyKey))
    // Every party that appealed - standing or withdrawn. Only parties absent
    // from this set (their decision was corrected away from APPEAL) lose their
    // event.
    const appealedKeys = new Set(appeals.map(partyKey))

    const eventsToAdd = appellants.filter(
      (appellant) => !existingKeys.has(partyKey(appellant)),
    )
    const eventsToRemove = existingEvents.filter(
      (event) => !appealedKeys.has(partyKey(event)),
    )

    await Promise.all(
      eventsToAdd.map((appellant) =>
        this.appealEventLogRepositoryService.create(
          buildInCourtAppealedEvent({ theCase, appealCase, appellant, actor }),
          { transaction },
        ),
      ),
    )

    await this.appealEventLogRepositoryService.deleteByIds(
      eventsToRemove.map((event) => event.id),
      { transaction },
    )
  }

  // Reconciles the ruling order's appeal case with the confirmed decisions, by
  // the state of the in-court appeals (decision = APPEAL):
  //  - at least one still standing (not withdrawn) -> create the appeal case if
  //    none exists yet (the decision rows are the record of who appealed);
  //  - some appeals but all withdrawn -> withdraw the appeal case (the parties
  //    withdrew; the appeal is discontinued, not erased - history is kept);
  //  - none at all (all corrected away) -> delete a still-APPEALED appeal case
  //    (a progressed appeal corrected away is rejected earlier by
  //    validateAppealCorrectionAllowed).
  // Idempotent, so re-confirming a corrected session converges.
  private async reconcileInCourtRulingOrderAppeal(
    theCase: Case,
    courtSession: CourtSession,
    user: TUser,
    transaction: Transaction,
  ): Promise<void> {
    const rulingFileId = courtSession.rulingFileId
    if (!rulingFileId) {
      return
    }

    const decisions = await this.appealDecisionRepositoryService.findAll({
      where: { caseId: theCase.id, rulingFileId },
      transaction,
    })
    const appeals = decisions.filter(
      (d) => d.decision === CaseAppealDecision.APPEAL,
    )
    const hasStandingAppeal = appeals.some((d) => !d.withdrawnDate)

    const existingAppealCase = theCase.rulingOrderAppealCases?.find(
      (appealCase) => appealCase.rulingFileId === rulingFileId,
    )

    // An appeal still stands - create the appeal case if it does not exist yet,
    // then converge its APPEALED events with the current standing appellants.
    if (hasStandingAppeal) {
      const appealCase =
        existingAppealCase ??
        (await this.appealCaseRepositoryService.create(
          theCase.id,
          {
            appealState: AppealCaseState.APPEALED,
            rulingFileId,
            // The in-court appeal happened when the court session ended
            appealDate: courtSession.endDate,
          },
          { transaction },
        ))

      if (!existingAppealCase) {
        addMessagesToQueue({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          user,
          caseId: theCase.id,
          elementId: appealCase.id,
          body: {
            type: AppealCaseNotificationType.APPEAL_TO_COURT_OF_APPEALS,
          },
        })
      }

      // Register the appellant on the appeal case in the event log, so it is read
      // from there uniformly with out-of-court appeals. The decision rows remain
      // the source for withdrawal state.
      await this.reconcileInCourtAppealedEvents(
        theCase,
        appealCase,
        appeals,
        user,
        transaction,
      )

      return
    }

    if (!existingAppealCase) {
      return
    }

    // Some parties appealed in court but all have withdrawn -> withdraw the
    // appeal case itself (unless it has already moved past where it can be
    // withdrawn). Reuses the appeal-case state machine so a RECEIVED appeal is
    // discontinued correctly.
    if (appeals.length > 0) {
      if (
        existingAppealCase.appealState === AppealCaseState.APPEALED ||
        existingAppealCase.appealState === AppealCaseState.RECEIVED
      ) {
        // The parties all withdrew, but they did appeal, so their APPEALED
        // events are kept (the withdrawal is recorded separately); only the
        // appeal case itself is withdrawn.
        const { appealCaseUpdate } = transitionAppealCase(
          AppealCaseTransition.WITHDRAW_APPEAL,
          theCase,
          existingAppealCase,
        )

        await this.appealCaseRepositoryService.update(
          existingAppealCase.id,
          appealCaseUpdate,
          { transaction },
        )

        addMessagesToQueue({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          user,
          caseId: theCase.id,
          elementId: existingAppealCase.id,
          body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
        })
      }

      return
    }

    // No in-court appeals remain (all corrected away) -> delete a still-APPEALED
    // appeal case.
    if (existingAppealCase.appealState === AppealCaseState.APPEALED) {
      await this.deleteInCourtRulingOrderAppeal(
        theCase,
        existingAppealCase,
        user,
        transaction,
      )
    }
  }

  // Reconciles the previously pronounced ruling after the session's ruling link
  // is changed.
  //  - Swap (the ruling order file is replaced by another): the same ruling is
  //    now represented by a new file, so the decisions, the appeal case and any
  //    appeal party files are re-pointed onto it - the in-court appeal continues
  //    uninterrupted and nothing is lost.
  //  - Removal (the ruling type moved away from ORDER, no new file): there is
  //    nothing to re-point onto, so a still-APPEALED appeal case is deleted (a
  //    progressed one was rejected up front by validateRulingRemovalAllowed).
  //    The decisions are left dormant rather than deleted.
  private async reconcileRulingLinkChange(
    theCase: Case,
    previousRulingFileId: string | null,
    nextRulingFileId: string | null,
    user: TUser,
    transaction: Transaction,
  ): Promise<void> {
    if (!previousRulingFileId) {
      return
    }

    const existingAppealCase = theCase.rulingOrderAppealCases?.find(
      (appealCase) => appealCase.rulingFileId === previousRulingFileId,
    )

    if (nextRulingFileId) {
      await this.appealDecisionRepositoryService.updateRulingFile(
        theCase.id,
        previousRulingFileId,
        nextRulingFileId,
        { transaction },
      )

      if (existingAppealCase) {
        await this.appealCaseRepositoryService.update(
          existingAppealCase.id,
          { rulingFileId: nextRulingFileId },
          { transaction },
        )

        const appealFiles = (theCase.caseFiles ?? []).filter(
          (file) =>
            file.rulingFileId === previousRulingFileId &&
            file.category &&
            APPEAL_PARTY_FILE_CATEGORIES.includes(file.category),
        )

        for (const file of appealFiles) {
          await this.fileService.updateCaseFile(
            theCase.id,
            file.id,
            { rulingFileId: nextRulingFileId },
            transaction,
          )
        }
      }

      return
    }

    if (
      existingAppealCase &&
      existingAppealCase.appealState === AppealCaseState.APPEALED
    ) {
      await this.deleteInCourtRulingOrderAppeal(
        theCase,
        existingAppealCase,
        user,
        transaction,
      )
    }

    // The session no longer pronounces a ruling order, so there is no file to
    // carry its decisions onto (unlike a swap). Discard them - leaving them
    // orphaned would let them resurface if the session is later pointed back at
    // the same ruling file (stale confirm validation / a resurrected appeal).
    await this.appealDecisionRepositoryService.deleteAllForRuling(
      theCase.id,
      previousRulingFileId,
      { transaction },
    )
  }

  // Hard-deletes an appeal case that was created from an in-court appeal that
  // has since been corrected away, together with the appeal files parties had
  // uploaded for it and its event logs. Only ever called for an APPEALED appeal
  // case. The deletion is audited on the case event log.
  private async deleteInCourtRulingOrderAppeal(
    theCase: Case,
    appealCase: AppealCase,
    user: TUser,
    transaction: Transaction,
  ): Promise<void> {
    const appealFiles = (theCase.caseFiles ?? []).filter(
      (file) =>
        file.rulingFileId === appealCase.rulingFileId &&
        file.category &&
        APPEAL_PARTY_FILE_CATEGORIES.includes(file.category),
    )

    for (const file of appealFiles) {
      await this.fileService.deleteCaseFile(theCase, file, transaction)
    }

    // Event logs reference the appeal case, so they must go before it
    await this.appealEventLogRepositoryService.deleteByAppealCaseId(
      appealCase.id,
      { transaction },
    )

    await this.appealCaseRepositoryService.delete(appealCase.id, {
      transaction,
    })

    await this.eventLogService.createWithUser(
      EventType.APPEAL_DELETED,
      theCase.id,
      user,
      transaction,
    )

    this.logger.debug(
      `Deleted in-court ruling order appeal ${appealCase.id} of case ${theCase.id} after court record correction`,
    )
  }

  private async validateAndNormalizeRulingFile(
    theCase: Case,
    existingCourtSession: CourtSession,
    update: UpdateCourtSessionDto,
  ): Promise<UpdateCourtSession> {
    const rulingTypeInUpdate = 'rulingType' in update
    const rulingFileIdInUpdate = 'rulingFileId' in update

    const effectiveRulingType = rulingTypeInUpdate
      ? update.rulingType
      : existingCourtSession.rulingType

    // Auto-clear: when the ruling type moves away from ORDER, drop any ruling file link.
    if (
      rulingTypeInUpdate &&
      update.rulingType !== CourtSessionRulingType.ORDER
    ) {
      return { ...update, rulingFileId: null }
    }

    // Validate a newly selected ruling file.
    if (rulingFileIdInUpdate && update.rulingFileId) {
      if (effectiveRulingType !== CourtSessionRulingType.ORDER) {
        throw new BadRequestException(
          'A ruling file can only be linked when the ruling type is ORDER',
        )
      }

      const caseFile = theCase.caseFiles?.find(
        (f) => f.id === update.rulingFileId,
      )

      if (!caseFile) {
        throw new NotFoundException(
          `Case file ${update.rulingFileId} of case ${theCase.id} does not exist`,
        )
      }

      if (
        caseFile.category !== CaseFileCategory.COURT_INDICTMENT_RULING_ORDER
      ) {
        throw new BadRequestException(
          'The selected file is not a court indictment ruling order',
        )
      }
    }

    // Required-at-confirm: confirming an ORDER session requires a linked file.
    const becomingConfirmed =
      update.isConfirmed === true && existingCourtSession.isConfirmed !== true

    if (
      becomingConfirmed &&
      effectiveRulingType === CourtSessionRulingType.ORDER
    ) {
      const effectiveRulingFileId = rulingFileIdInUpdate
        ? update.rulingFileId
        : existingCourtSession.rulingFileId

      if (!effectiveRulingFileId) {
        throw new BadRequestException(
          'A ruling file must be selected before an ORDER court session can be confirmed',
        )
      }
    }

    return update
  }

  // Records a party's in-court appeal decision (Ákvörðun um kæru) against the
  // ruling order pronounced in the session. The ruling file comes from the
  // session, never the client, so a decision can only attach to this case's own
  // ruling. decision/announcement are both optional - an announcement may be
  // entered before the decision radio is picked.
  async upsertAppealDecision(
    theCase: Case,
    courtSession: CourtSession,
    update: CourtSessionAppealDecisionDto,
    transaction: Transaction,
  ): Promise<AppealDecision> {
    if (
      courtSession.rulingType !== CourtSessionRulingType.ORDER ||
      !courtSession.rulingFileId
    ) {
      throw new BadRequestException(
        'Appeal decisions can only be recorded on a court session with a pronounced ruling order',
      )
    }

    this.validateAppealDecisionParty(theCase, update)

    const data: {
      decision?: CaseAppealDecision | null
      announcement?: string | null
      withdrawnDate?: Date | null
    } = {}
    if (update.decision !== undefined) {
      const newDecision = update.decision ?? null
      data.decision = newDecision

      // Recording a *changed* decision is a fresh statement of the party's
      // stance, so it clears any prior in-court appeal withdrawal. Confirm the
      // decision actually changed server-side - never rely on the client not to
      // re-send an unchanged decision and accidentally un-withdraw the party.
      const [existing] = await this.appealDecisionRepositoryService.findAll({
        where: {
          caseId: theCase.id,
          rulingFileId: courtSession.rulingFileId,
          partyRole: update.partyRole,
          defendantId: update.defendantId ?? null,
          civilClaimantId: update.civilClaimantId ?? null,
        },
        transaction,
      })
      if ((existing?.decision ?? null) !== newDecision) {
        data.withdrawnDate = null
      }
    }
    if (update.announcement !== undefined) {
      data.announcement = update.announcement ?? null
    }

    return this.appealDecisionRepositoryService.upsert(
      {
        caseId: theCase.id,
        rulingFileId: courtSession.rulingFileId,
        partyRole: update.partyRole,
        defendantId: update.defendantId,
        civilClaimantId: update.civilClaimantId,
      },
      data,
      { transaction },
    )
  }

  private validateAppealDecisionParty(
    theCase: Case,
    update: CourtSessionAppealDecisionDto,
  ): void {
    const { partyRole, defendantId, civilClaimantId } = update

    switch (partyRole) {
      case AppealDecisionPartyRole.PROSECUTOR:
        if (defendantId || civilClaimantId) {
          throw new BadRequestException(
            'A prosecution appeal decision must not reference a defendant or civil claimant',
          )
        }
        break
      case AppealDecisionPartyRole.DEFENDANT:
        if (!defendantId || civilClaimantId) {
          throw new BadRequestException(
            'A defendant appeal decision must reference a defendant only',
          )
        }
        if (!theCase.defendants?.some((d) => d.id === defendantId)) {
          throw new NotFoundException(
            `Defendant ${defendantId} does not belong to case ${theCase.id}`,
          )
        }
        break
      case AppealDecisionPartyRole.CIVIL_CLAIMANT:
        if (!civilClaimantId || defendantId) {
          throw new BadRequestException(
            'A civil claimant appeal decision must reference a civil claimant only',
          )
        }
        if (!theCase.civilClaimants?.some((c) => c.id === civilClaimantId)) {
          throw new NotFoundException(
            `Civil claimant ${civilClaimantId} does not belong to case ${theCase.id}`,
          )
        }
        break
    }
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtSessionRepositoryService.delete(caseId, courtSessionId, {
      transaction,
    })

    return true
  }
}
