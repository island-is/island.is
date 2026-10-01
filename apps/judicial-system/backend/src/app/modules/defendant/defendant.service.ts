import { Transaction } from 'sequelize'

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  AppealCaseState,
  AppealCaseTransition,
  CaseIndictmentRulingDecision,
  DefendantEventType,
  DefendantNotificationType,
  DefenderChoice,
  IndictmentCaseReviewDecision,
  isIndictmentCase,
  isPrisonAdminUser,
  RequestCaseNotificationType,
} from '@island.is/judicial-system/types'

import { hasStandingVerdictAppeal } from '../appeal-case/appealCase.helpers'
import { AppealCaseService } from '../appeal-case/appealCase.service'
import { CourtService } from '../court'
import {
  Case,
  Defendant,
  DefendantEventLog,
  DefendantEventLogRepositoryService,
  DefendantRepositoryService,
  UpdateDefendant,
} from '../repository'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { InternalUpdateDefendantDto } from './dto/internalUpdateDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class DefendantService {
  constructor(
    private readonly defendantRepositoryService: DefendantRepositoryService,
    private readonly defendantEventLogRepositoryService: DefendantEventLogRepositoryService,
    private readonly courtService: CourtService,
    @Inject(forwardRef(() => AppealCaseService))
    private readonly appealCaseService: AppealCaseService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private addMessagesForSendDefendantsNotUpdatedAtCourtNotificationToQueue(
    theCase: Case,
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: {
        type: RequestCaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
      },
    })
  }

  private hasValidDefendantNationalIdForCourtDelivery(
    defendant: Defendant,
  ): defendant is Defendant & { nationalId: string } {
    const { nationalId } = defendant

    if (defendant.noNationalId || !nationalId) {
      return false
    }

    return (
      nationalId.replace('-', '').length === 10 && !nationalId.endsWith('5') // Temporary national id from the police system
    )
  }

  private addMessagesForDeliverDefendantToCourtToQueue(
    defendant: Defendant,
    user: User,
  ): void {
    addMessagesToQueue(
      {
        type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
        user,
        caseId: defendant.caseId,
        elementId: defendant.id,
      },
      {
        type: MessageType.DELIVERY_TO_COURT_REQUEST_DEFENDANT,
        user,
        caseId: defendant.caseId,
        elementId: defendant.id,
      },
    )
  }

  private addMessagesForIndictmentToPrisonAdminChangesToQueue(
    defendant: Defendant,
    caseId: string,
  ): void {
    const messageType =
      defendant.isSentToPrisonAdmin === true
        ? DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN
        : DefendantNotificationType.INDICTMENT_WITHDRAWN_FROM_PRISON_ADMIN

    addMessagesToQueue({
      type: MessageType.DEFENDANT_NOTIFICATION,
      caseId,
      elementId: defendant.id,
      body: { type: messageType },
    })
  }

  private addMessagesForRequestCaseUpdateDefendantToQueue(
    theCase: Case,
    updatedDefendant: Defendant,
    oldDefendant: Defendant,
    user: User,
  ): void {
    if (!theCase.courtCaseNumber) {
      return
    }

    // Handling of updates sent to the court system
    // A defendant is updated after the case has been received by the court.
    if (updatedDefendant.noNationalId !== oldDefendant.noNationalId) {
      // A defendant nationalId is added or removed. Attempt to add the defendant to the court case.
      // In case there is no national id, the court will be notified.
      this.addMessagesForDeliverDefendantToCourtToQueue(updatedDefendant, user)
    } else if (updatedDefendant.nationalId !== oldDefendant.nationalId) {
      // A defendant is replaced. Attempt to add the defendant to the court case,
      // but also ask the court to verify defendants.
      this.addMessagesForSendDefendantsNotUpdatedAtCourtNotificationToQueue(
        theCase,
        user,
      )
      this.addMessagesForDeliverDefendantToCourtToQueue(updatedDefendant, user)
    }
  }

  private addMessagesForIndictmentCaseUpdateDefendantToQueue(
    theCase: Case,
    updatedDefendant: Defendant,
    oldDefendant: Defendant,
    user: User,
  ): void {
    if (!theCase.courtCaseNumber) {
      return
    }

    if (
      updatedDefendant.isDefenderChoiceConfirmed &&
      !oldDefendant.isDefenderChoiceConfirmed
    ) {
      // Defender choice was just confirmed by the court
      addMessagesToQueue({
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_DEFENDANT,
        user,
        caseId: theCase.id,
        elementId: updatedDefendant.id,
      })

      if (
        updatedDefendant.defenderChoice === DefenderChoice.CHOOSE ||
        updatedDefendant.defenderChoice === DefenderChoice.DELEGATE
      ) {
        // Defender was just confirmed by judge
        if (!oldDefendant.isDefenderChoiceConfirmed) {
          // send general defender assignment email
          addMessagesToQueue({
            type: MessageType.DEFENDANT_NOTIFICATION,
            caseId: theCase.id,
            body: { type: DefendantNotificationType.DEFENDER_ASSIGNED },
            elementId: updatedDefendant.id,
          })
          // send a notification to follow-up on scheduled court date
          addMessagesToQueue({
            type: MessageType.DEFENDANT_NOTIFICATION,
            caseId: theCase.id,
            user,
            body: {
              type: DefendantNotificationType.DEFENDER_COURT_DATE_FOLLOW_UP,
            },
            elementId: updatedDefendant.id,
          })
        }
      }
    } else if (
      updatedDefendant.isSentToPrisonAdmin !== undefined &&
      updatedDefendant.isSentToPrisonAdmin !== oldDefendant.isSentToPrisonAdmin
    ) {
      this.addMessagesForIndictmentToPrisonAdminChangesToQueue(
        updatedDefendant,
        theCase.id,
      )
    }
  }

  async createForNewCase(
    caseId: string,
    defendantToCreate: CreateDefendantDto,
    transaction: Transaction,
  ): Promise<Defendant> {
    return this.defendantRepositoryService.create(
      { ...defendantToCreate, caseId },
      { transaction },
    )
  }

  async create(
    theCase: Case,
    defendantToCreate: CreateDefendantDto,
    user: User,
    transaction: Transaction,
  ): Promise<Defendant> {
    const defendant = await this.defendantRepositoryService.create(
      { ...defendantToCreate, caseId: theCase.id },
      { transaction },
    )

    if (theCase.courtCaseNumber) {
      // This should only happen to non-indictment cases.
      // A defendant is added after the case has been received by the court.
      // Attempt to add the new defendant to the court case.
      this.addMessagesForDeliverDefendantToCourtToQueue(defendant, user)
    }

    return defendant
  }

  async updateDatabaseDefendant(
    caseId: string,
    defendantId: string,
    update: UpdateDefendant,
    transaction: Transaction,
  ) {
    return this.defendantRepositoryService.update(caseId, defendantId, update, {
      transaction,
    })
  }

  private async updateRequestCaseDefendant(
    theCase: Case,
    defendant: Defendant,
    update: UpdateDefendantDto,
    user: User,
    transaction: Transaction,
  ): Promise<Defendant> {
    const updatedDefendant = await this.updateDatabaseDefendant(
      theCase.id,
      defendant.id,
      update,
      transaction,
    )

    this.addMessagesForRequestCaseUpdateDefendantToQueue(
      theCase,
      updatedDefendant,
      defendant,
      user,
    )

    return updatedDefendant
  }

  async createDefendantEvent(
    event: {
      caseId: string
      defendantId: string
      eventType: DefendantEventType
      verdictId?: string
      user?: User
    },
    transaction: Transaction,
  ): Promise<void> {
    if (event.user) {
      await this.defendantEventLogRepositoryService.createWithUser(
        event.eventType,
        event.caseId,
        event.defendantId,
        event.user,
        transaction,
        ...(event.verdictId ? [{ verdictId: event.verdictId }] : []),
      )

      return
    }

    await this.defendantEventLogRepositoryService.create(event, {
      transaction,
    })
  }

  private async handleEventLogUpdates(
    theCase: Case,
    defendant: Defendant,
    updatedDefendant: UpdateDefendantDto,
    user: User,
    transaction: Transaction,
  ) {
    if (
      updatedDefendant.indictmentReviewDecision &&
      updatedDefendant.indictmentReviewDecision !==
        defendant.indictmentReviewDecision
    ) {
      await this.createDefendantEvent(
        {
          caseId: theCase.id,
          defendantId: defendant.id,
          eventType: DefendantEventType.INDICTMENT_REVIEWED,
          user,
        },
        transaction,
      )
    }
  }

  /**
   * Files or withdraws the prosecution's verdict appeal for this defendant,
   * from the review decision that is being saved and in the same transaction.
   *
   * For the public prosecution the reviewer's decision *is* the appeal, so the
   * two must not be able to drift apart: deciding to appeal files one, taking
   * the decision back withdraws it, and either the pair lands or neither does.
   *
   * Only ever reached when the API asked for it - it reads the
   * INDICTMENT_APPEAL feature, the backend does not.
   */
  private async handleVerdictAppealUpdates(
    theCase: Case,
    defendant: Defendant,
    update: UpdateDefendantDto,
    user: User,
    transaction: Transaction,
  ) {
    const decision = update.indictmentReviewDecision

    // Only a decision that actually changed is an act of review, and only a
    // ruling is appealed this way - a fine is appealed as a ruling order.
    if (
      decision === undefined ||
      decision === defendant.indictmentReviewDecision ||
      theCase.indictmentRulingDecision !== CaseIndictmentRulingDecision.RULING
    ) {
      return
    }

    if (decision === IndictmentCaseReviewDecision.APPEAL) {
      await this.appealCaseService.create(
        theCase,
        user,
        undefined,
        transaction,
        {
          defendantId: defendant.id,
        },
      )

      return
    }

    // Changed away from an appeal. A decision recorded as APPEAL before verdict
    // appeals were switched on has no appeal case and no event behind it -
    // there is nothing to withdraw, and asking to withdraw it would be refused.
    if (
      defendant.indictmentReviewDecision !==
        IndictmentCaseReviewDecision.APPEAL ||
      !theCase.verdictAppealCase ||
      !hasStandingVerdictAppeal(
        theCase.verdictAppealCase,
        defendant.id,
        'PROSECUTION',
      )
    ) {
      return
    }

    await this.appealCaseService.transition(
      theCase,
      theCase.verdictAppealCase,
      AppealCaseTransition.WITHDRAW_APPEAL,
      user,
      transaction,
      defendant.id,
    )
  }

  private async updateIndictmentCaseDefendant(
    theCase: Case,
    defendant: Defendant,
    update: UpdateDefendantDto,
    user: User,
    transaction: Transaction,
    registerVerdictAppeal?: boolean,
  ): Promise<Defendant> {
    const updatedDefendant = await this.updateDatabaseDefendant(
      theCase.id,
      defendant.id,
      update,
      transaction,
    )

    if (update.isSentToPrisonAdmin) {
      await this.createDefendantEvent(
        {
          caseId: theCase.id,
          defendantId: defendant.id,
          eventType: DefendantEventType.SENT_TO_PRISON_ADMIN,
        },
        transaction,
      )
    }

    if (
      update.isClosedWithoutEnforcement &&
      !defendant.isClosedWithoutEnforcement
    ) {
      await this.createDefendantEvent(
        {
          caseId: theCase.id,
          defendantId: defendant.id,
          eventType: DefendantEventType.CLOSED_WITHOUT_ENFORCEMENT,
          user,
        },
        transaction,
      )
    }

    this.addMessagesForIndictmentCaseUpdateDefendantToQueue(
      theCase,
      updatedDefendant,
      defendant,
      user,
    )

    await this.handleEventLogUpdates(
      theCase,
      defendant,
      updatedDefendant,
      user,
      transaction,
    )

    if (registerVerdictAppeal) {
      await this.handleVerdictAppealUpdates(
        theCase,
        defendant,
        update,
        user,
        transaction,
      )
    }

    if (
      update.punishmentType !== undefined &&
      update.punishmentType !== null &&
      isPrisonAdminUser(user)
    ) {
      const eventLogs = defendant.eventLogs ?? []
      if (
        defendant.isSentToPrisonAdmin &&
        !DefendantEventLog.hasValidOpenByPrisonAdminEvent(eventLogs)
      ) {
        await this.createDefendantEvent(
          {
            caseId: theCase.id,
            defendantId: defendant.id,
            eventType: DefendantEventType.OPENED_BY_PRISON_ADMIN,
            user,
          },
          transaction,
        )
      }
    }

    return updatedDefendant
  }

  async update(
    theCase: Case,
    defendant: Defendant,
    updateWithIntent: UpdateDefendantDto,
    user: User,
    transaction: Transaction,
  ): Promise<Defendant> {
    // The intent to file or withdraw the prosecution's verdict appeal rides
    // along with the decision but is not a defendant field, so it never reaches
    // the database update.
    const { registerVerdictAppeal, ...updateFields } = updateWithIntent
    let update: UpdateDefendantDto = updateFields
    // Closing without enforcement is only valid for indictment defendants and
    // is irreversible through this endpoint - reopening a case resets the flag
    // in the case reopen workflow.
    if (update.isClosedWithoutEnforcement !== undefined) {
      if (
        !isIndictmentCase(theCase.type) ||
        update.isClosedWithoutEnforcement !== true
      ) {
        throw new BadRequestException(
          'Closed without enforcement can only be set for indictment case defendants',
        )
      }

      // Enforcement is mutually exclusive with closing without enforcement -
      // a defendant sent to prison admin must be withdrawn first.
      if (defendant.isSentToPrisonAdmin || update.isSentToPrisonAdmin) {
        throw new BadRequestException(
          'Closed without enforcement cannot be set for a defendant sent to prison admin',
        )
      }
    }

    if (
      update.defenderNationalId === null &&
      !(
        update.defenderEmail === null &&
        update.defenderName === null &&
        update.defenderPhoneNumber === null
      )
    ) {
      const { defenderNationalId: _, ...rest } = update
      update = rest
    }

    // The reviewer's decision on an indictment verdict is the prosecution's
    // appeal or its absence. Once the court of appeals has received the verdict
    // appeal the decision is made; the web creates and withdraws the appeal
    // from the decision, and this keeps the two from drifting apart.
    if (
      update.indictmentReviewDecision !== undefined &&
      update.indictmentReviewDecision !== defendant.indictmentReviewDecision &&
      theCase.verdictAppealCase &&
      theCase.verdictAppealCase.appealState !== AppealCaseState.APPEALED &&
      theCase.verdictAppealCase.appealState !== AppealCaseState.WITHDRAWN
    ) {
      throw new BadRequestException(
        'The review decision cannot change once the court of appeals has received the verdict appeal',
      )
    }

    if (isIndictmentCase(theCase.type)) {
      return this.updateIndictmentCaseDefendant(
        theCase,
        defendant,
        update,
        user,
        transaction,
        registerVerdictAppeal,
      )
    } else {
      return this.updateRequestCaseDefendant(
        theCase,
        defendant,
        update,
        user,
        transaction,
      )
    }
  }

  async updateRestricted(
    theCase: Case,
    defendant: Defendant,
    update: InternalUpdateDefendantDto,
    transaction: Transaction,
  ): Promise<Defendant> {
    // The reason we have a separate dto for this is because requests that end here
    // are initiated by outside API's which should not be able to edit other fields directly
    // Defendant updates originating from the judicial system should use the UpdateDefendantDto
    // and go through the update method above using the defendantId.
    if (
      update.defenderNationalId === null &&
      !(
        update.defenderEmail === null &&
        update.defenderName === null &&
        update.defenderPhoneNumber === null
      )
    ) {
      const { defenderNationalId: _, ...rest } = update
      update = rest
    }

    // If there is a change in the defender choice after the judge has confirmed the choice,
    // we need to set the isDefenderChoiceConfirmed to false
    const resetDefenderChoiceConfirmed =
      defendant?.isDefenderChoiceConfirmed &&
      ((update.defenderChoice &&
        defendant?.defenderChoice !== update.defenderChoice) ||
        (update.defenderNationalId &&
          defendant?.defenderNationalId !== update.defenderNationalId))

    const updatedDefendant = await this.updateDatabaseDefendant(
      theCase.id,
      defendant.id,
      {
        ...update,
        ...(resetDefenderChoiceConfirmed && {
          isDefenderChoiceConfirmed: false,
        }),
      },
      transaction,
    )

    if (updatedDefendant.defenderChoice === DefenderChoice.DELEGATE) {
      addMessagesToQueue({
        type: MessageType.DEFENDANT_NOTIFICATION,
        caseId: theCase.id,
        elementId: updatedDefendant.id,
        body: {
          type: DefendantNotificationType.DEFENDANT_DELEGATED_DEFENDER_CHOICE,
        },
      })
    } else if (
      !updatedDefendant.isDefenderChoiceConfirmed &&
      updatedDefendant.defenderChoice === DefenderChoice.CHOOSE &&
      (updatedDefendant.defenderChoice !== defendant.defenderChoice ||
        updatedDefendant.defenderNationalId !== defendant.defenderNationalId)
    ) {
      // Notify the court if the defendant has changed the defender choice
      addMessagesToQueue({
        type: MessageType.DEFENDANT_NOTIFICATION,
        caseId: theCase.id,
        elementId: updatedDefendant.id,
        body: { type: DefendantNotificationType.DEFENDANT_SELECTED_DEFENDER },
      })
    }

    return updatedDefendant
  }

  async delete(
    theCase: Case,
    defendantId: string,
    user: User,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.defendantRepositoryService.delete(theCase.id, defendantId, {
      transaction,
    })

    if (theCase.courtCaseNumber) {
      // This should only happen to non-indictment cases.
      // A defendant is removed after the case has been received by the court.
      // Ask the court to verify defendants.
      this.addMessagesForSendDefendantsNotUpdatedAtCourtNotificationToQueue(
        theCase,
        user,
      )
    }

    return true
  }

  async syncDefenderToAllDefendants(
    caseId: string,
    defenderFields: {
      defenderName?: string | null
      defenderNationalId?: string | null
      defenderEmail?: string | null
      defenderPhoneNumber?: string | null
      defenderChoice?: DefenderChoice | null
    },
    transaction: Transaction,
  ): Promise<void> {
    const update: UpdateDefendant = {}

    if (defenderFields.defenderName !== undefined) {
      update.defenderName = defenderFields.defenderName
    }
    if (defenderFields.defenderNationalId !== undefined) {
      update.defenderNationalId = defenderFields.defenderNationalId
    }
    if (defenderFields.defenderEmail !== undefined) {
      update.defenderEmail = defenderFields.defenderEmail
    }
    if (defenderFields.defenderPhoneNumber !== undefined) {
      update.defenderPhoneNumber = defenderFields.defenderPhoneNumber
    }
    if (defenderFields.defenderChoice !== undefined) {
      update.defenderChoice = defenderFields.defenderChoice
    }

    if (Object.keys(update).length === 0) {
      return
    }

    await this.defendantRepositoryService.updateAllForCase(caseId, update, {
      transaction,
    })
  }

  async isDefendantInActiveCustody(defendants?: Defendant[]): Promise<boolean> {
    if (
      !defendants ||
      !defendants[0]?.nationalId ||
      defendants[0]?.noNationalId
    ) {
      return false
    }

    return this.defendantRepositoryService.existsInActiveCustody(
      defendants[0].nationalId,
    )
  }

  async deliverDefendantToCourt(
    theCase: Case,
    defendant: Defendant,
    user: User,
  ): Promise<DeliverResponse> {
    if (!this.hasValidDefendantNationalIdForCourtDelivery(defendant)) {
      this.addMessagesForSendDefendantsNotUpdatedAtCourtNotificationToQueue(
        theCase,
        user,
      )

      return { delivered: true }
    }

    return this.courtService
      .updateCaseWithDefendant(
        user,
        theCase.id,
        theCase.courtId ?? '',
        theCase.courtCaseNumber ?? '',
        defendant.nationalId.replace('-', ''),
        theCase.defenderEmail,
      )
      .then(() => {
        return { delivered: true }
      })
      .catch((reason) => {
        this.logger.error('Failed to update case with defendant', { reason })

        return { delivered: false }
      })
  }

  async deliverRequestDefendantToCourt(
    theCase: Case,
    defendant: Defendant,
    user: User,
  ): Promise<DeliverResponse> {
    if (!this.hasValidDefendantNationalIdForCourtDelivery(defendant)) {
      return { delivered: true }
    }

    return this.courtService
      .updateRequestCaseWithDefenderInfo(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        defendant.nationalId,
        theCase.defenderName,
        theCase.defenderEmail,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to deliver defender info for defendant ${defendant.id} of request case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
  }

  async deliverIndictmentDefendantToCourt(
    theCase: Case,
    defendant: Defendant,
    user: User,
  ): Promise<DeliverResponse> {
    return this.courtService
      .updateIndictmentCaseWithDefenderInfo(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        defendant.nationalId,
        defendant.defenderName,
        defendant.defenderEmail,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update defendant info for defendant ${defendant.id} of indictment case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
  }
}
