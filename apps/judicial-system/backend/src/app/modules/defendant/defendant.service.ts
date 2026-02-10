import { literal, Op, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseNotificationType,
  CaseState,
  CaseType,
  DefendantEventType,
  DefendantNotificationType,
  DefenderChoice,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { CourtService } from '../court'
import {
  Case,
  Defendant,
  DefendantEventLogRepositoryService,
  DefendantRepositoryService,
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
      body: { type: CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT },
    })
  }

  private addMessagesForDeliverDefendantToCourtToQueue(
    defendant: Defendant,
    user: User,
  ): void {
    addMessagesToQueue({
      type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
      user,
      caseId: defendant.caseId,
      elementId: defendant.id,
    })
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
        type: MessageType.DELIVERY_TO_COURT_INDICTMENT_DEFENDER,
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
    update: UpdateDefendantDto,
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
    },
    transaction: Transaction,
  ): Promise<void> {
    await this.defendantEventLogRepositoryService.create(event, { transaction })
  }

  private async updateIndictmentCaseDefendant(
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

    this.addMessagesForIndictmentCaseUpdateDefendantToQueue(
      theCase,
      updatedDefendant,
      defendant,
      user,
    )

    return updatedDefendant
  }

  async update(
    theCase: Case,
    defendant: Defendant,
    update: UpdateDefendantDto,
    user: User,
    transaction: Transaction,
  ): Promise<Defendant> {
    if (isIndictmentCase(theCase.type)) {
      return this.updateIndictmentCaseDefendant(
        theCase,
        defendant,
        update,
        user,
        transaction,
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

  async isDefendantInActiveCustody(defendants?: Defendant[]): Promise<boolean> {
    if (
      !defendants ||
      !defendants[0]?.nationalId ||
      defendants[0]?.noNationalId
    ) {
      return false
    }

    const defendantsInCustody = await this.defendantRepositoryService.findAll({
      include: [
        {
          model: Case,
          as: 'case',
          where: {
            state: CaseState.ACCEPTED,
            type: CaseType.CUSTODY,
            valid_to_date: { [Op.gte]: literal('current_date') },
          },
        },
      ],
      where: { nationalId: defendants[0].nationalId },
    })

    return defendantsInCustody.some((d) => d.case)
  }

  findLatestDefendantByDefenderNationalId(
    nationalId: string,
  ): Promise<Defendant | null> {
    return this.defendantRepositoryService.findOne({
      include: [
        {
          model: Case,
          as: 'case',
          where: {
            state: { [Op.not]: CaseState.DELETED },
            isArchived: false,
          },
        },
      ],
      where: { defenderNationalId: normalizeAndFormatNationalId(nationalId) },
      order: [['created', 'DESC']],
    })
  }

  async deliverDefendantToCourt(
    theCase: Case,
    defendant: Defendant,
    user: User,
  ): Promise<DeliverResponse> {
    if (
      defendant.noNationalId ||
      !defendant.nationalId ||
      defendant.nationalId.replace('-', '').length !== 10 ||
      defendant.nationalId.endsWith('5') // Temporary national id from the police system
    ) {
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

  async deliverIndictmentDefenderToCourt(
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
          `Failed to update defender info for defendant ${defendant.id} of indictment case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
  }
}
