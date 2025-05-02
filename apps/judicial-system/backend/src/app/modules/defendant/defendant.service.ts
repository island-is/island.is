import { literal, Op } from 'sequelize'
import { Transaction } from 'sequelize/types'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  Message,
  MessageService,
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

import { Case } from '../case/models/case.model'
import { CourtService } from '../court'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { InternalUpdateDefendantDto } from './dto/internalUpdateDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { Defendant } from './models/defendant.model'
import { DefendantEventLog } from './models/defendantEventLog.model'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class DefendantService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    @InjectModel(DefendantEventLog)
    private readonly defendantEventLogModel: typeof DefendantEventLog,
    private readonly courtService: CourtService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getMessageForSendDefendantsNotUpdatedAtCourtNotification(
    theCase: Case,
    user: User,
  ): Message {
    return {
      type: MessageType.NOTIFICATION,
      user,
      caseId: theCase.id,
      body: { type: CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT },
    }
  }

  private getMessageForDeliverDefendantToCourt(
    defendant: Defendant,
    user: User,
  ): Message {
    const message = {
      type: MessageType.DELIVERY_TO_COURT_DEFENDANT,
      user,
      caseId: defendant.caseId,
      elementId: defendant.id,
    }

    return message
  }

  private getMessagesForIndictmentToPrisonAdminChanges(
    defendant: Defendant,
    caseId: string,
  ): Message {
    const messageType =
      defendant.isSentToPrisonAdmin === true
        ? DefendantNotificationType.INDICTMENT_SENT_TO_PRISON_ADMIN
        : DefendantNotificationType.INDICTMENT_WITHDRAWN_FROM_PRISON_ADMIN

    const message = {
      type: MessageType.DEFENDANT_NOTIFICATION,
      caseId,
      elementId: defendant.id,
      body: {
        type: messageType,
      },
    }

    return message
  }

  private async sendRequestCaseUpdateDefendantMessages(
    theCase: Case,
    updatedDefendant: Defendant,
    oldDefendant: Defendant,
    user: User,
  ): Promise<void> {
    if (!theCase.courtCaseNumber) {
      return
    }

    const messages: Message[] = []

    // Handling of updates sent to the court system
    // A defendant is updated after the case has been received by the court.
    if (updatedDefendant.noNationalId !== oldDefendant.noNationalId) {
      // A defendant nationalId is added or removed. Attempt to add the defendant to the court case.
      // In case there is no national id, the court will be notified.
      messages.push(
        this.getMessageForDeliverDefendantToCourt(updatedDefendant, user),
      )
    } else if (updatedDefendant.nationalId !== oldDefendant.nationalId) {
      // A defendant is replaced. Attempt to add the defendant to the court case,
      // but also ask the court to verify defendants.
      messages.push(
        this.getMessageForSendDefendantsNotUpdatedAtCourtNotification(
          theCase,
          user,
        ),
        this.getMessageForDeliverDefendantToCourt(updatedDefendant, user),
      )
    }

    if (messages.length === 0) {
      return
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  private async sendIndictmentCaseUpdateDefendantMessages(
    theCase: Case,
    updatedDefendant: Defendant,
    oldDefendant: Defendant,
    user: User,
  ): Promise<void> {
    if (!theCase.courtCaseNumber) {
      return
    }

    const messages: Message[] = []

    if (
      updatedDefendant.isDefenderChoiceConfirmed &&
      !oldDefendant.isDefenderChoiceConfirmed
    ) {
      // Defender choice was just confirmed by the court
      messages.push({
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
          messages.push({
            type: MessageType.DEFENDANT_NOTIFICATION,
            caseId: theCase.id,
            body: { type: DefendantNotificationType.DEFENDER_ASSIGNED },
            elementId: updatedDefendant.id,
          })
        }
      }
    } else if (
      updatedDefendant.isSentToPrisonAdmin !== undefined &&
      updatedDefendant.isSentToPrisonAdmin !== oldDefendant.isSentToPrisonAdmin
    ) {
      messages.push(
        this.getMessagesForIndictmentToPrisonAdminChanges(
          updatedDefendant,
          theCase.id,
        ),
      )
    }

    if (messages.length === 0) {
      return
    }

    return this.messageService.sendMessagesToQueue(messages)
  }

  async createForNewCase(
    caseId: string,
    defendantToCreate: CreateDefendantDto,
    transaction: Transaction,
  ): Promise<Defendant> {
    return this.defendantModel.create(
      { ...defendantToCreate, caseId },
      { transaction },
    )
  }

  async create(
    theCase: Case,
    defendantToCreate: CreateDefendantDto,
    user: User,
  ): Promise<Defendant> {
    const defendant = await this.defendantModel.create({
      ...defendantToCreate,
      caseId: theCase.id,
    })

    if (theCase.courtCaseNumber) {
      // This should only happen to non-indictment cases.
      // A defendant is added after the case has been received by the court.
      // Attempt to add the new defendant to the court case.
      await this.messageService.sendMessagesToQueue([
        this.getMessageForDeliverDefendantToCourt(defendant, user),
      ])
    }

    return defendant
  }

  async updateDatabaseDefendant(
    caseId: string,
    defendantId: string,
    update: UpdateDefendantDto,
    transaction?: Transaction,
  ) {
    const [numberOfAffectedRows, defendants] = await this.defendantModel.update(
      update,
      { where: { id: defendantId, caseId }, returning: true, transaction },
    )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating defendant ${defendantId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update defendant ${defendantId} of case ${caseId}`,
      )
    }

    return defendants[0]
  }

  async updateRequestCaseDefendant(
    theCase: Case,
    defendant: Defendant,
    update: UpdateDefendantDto,
    user: User,
  ): Promise<Defendant> {
    const updatedDefendant = await this.updateDatabaseDefendant(
      theCase.id,
      defendant.id,
      update,
    )

    await this.sendRequestCaseUpdateDefendantMessages(
      theCase,
      updatedDefendant,
      defendant,
      user,
    )

    return updatedDefendant
  }

  async createDefendantEvent({
    caseId,
    defendantId,
    eventType,
  }: {
    caseId: string
    defendantId: string
    eventType: DefendantEventType
  }): Promise<void> {
    await this.defendantEventLogModel.create({
      caseId,
      defendantId,
      eventType,
    })
  }

  async updateIndictmentCaseDefendant(
    theCase: Case,
    defendant: Defendant,
    update: UpdateDefendantDto,
    user: User,
  ): Promise<Defendant> {
    const updatedDefendant = await this.updateDatabaseDefendant(
      theCase.id,
      defendant.id,
      update,
    )

    if (update.isSentToPrisonAdmin) {
      this.createDefendantEvent({
        caseId: theCase.id,
        defendantId: defendant.id,
        eventType: DefendantEventType.SENT_TO_PRISON_ADMIN,
      })
    }

    await this.sendIndictmentCaseUpdateDefendantMessages(
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
  ): Promise<Defendant> {
    if (isIndictmentCase(theCase.type)) {
      return this.updateIndictmentCaseDefendant(
        theCase,
        defendant,
        update,
        user,
      )
    } else {
      return this.updateRequestCaseDefendant(theCase, defendant, update, user)
    }
  }

  async updateRestricted(
    theCase: Case,
    defendant: Defendant,
    update: InternalUpdateDefendantDto,
    isDefenderChoiceConfirmed = false,
    transaction?: Transaction,
  ): Promise<Defendant> {
    // The reason we have a separate dto for this is because requests that end here
    // are initiated by outside API's which should not be able to edit other fields
    // Defendant updated originating from the judicial system should use the UpdateDefendantDto
    // and go through the update method above using the defendantId.
    // This is also why we may set the isDefenderChoiceConfirmed to false here - the judge needs to confirm all changes.

    const updatedDefendant = await this.updateDatabaseDefendant(
      theCase.id,
      defendant.id,
      { ...update, isDefenderChoiceConfirmed },
      transaction,
    )

    if (updatedDefendant.defenderChoice === DefenderChoice.DELEGATE) {
      await this.messageService.sendMessagesToQueue([
        {
          type: MessageType.DEFENDANT_NOTIFICATION,
          caseId: theCase.id,
          elementId: updatedDefendant.id,
          body: {
            type: DefendantNotificationType.DEFENDANT_DELEGATED_DEFENDER_CHOICE,
          },
        },
      ])
    } else if (
      !updatedDefendant.isDefenderChoiceConfirmed &&
      updatedDefendant.defenderChoice === DefenderChoice.CHOOSE &&
      (updatedDefendant.defenderChoice !== defendant.defenderChoice ||
        updatedDefendant.defenderNationalId !== defendant.defenderNationalId)
    ) {
      // Notify the court if the defendant has changed the defender choice
      await this.messageService.sendMessagesToQueue([
        {
          type: MessageType.DEFENDANT_NOTIFICATION,
          caseId: theCase.id,
          elementId: updatedDefendant.id,
          body: {
            type: DefendantNotificationType.DEFENDANT_SELECTED_DEFENDER,
          },
        },
      ])
    }

    return updatedDefendant
  }

  async delete(
    theCase: Case,
    defendantId: string,
    user: User,
  ): Promise<boolean> {
    const numberOfAffectedRows = await this.defendantModel.destroy({
      where: { id: defendantId, caseId: theCase.id },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting defendant ${defendantId} of case ${theCase.id}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete defendant ${defendantId} of case ${theCase.id}`,
      )
    }

    if (theCase.courtCaseNumber) {
      // This should only happen to non-indictment cases.
      // A defendant is removed after the case has been received by the court.
      // Ask the court to verify defendants.
      await this.messageService.sendMessagesToQueue([
        this.getMessageForSendDefendantsNotUpdatedAtCourtNotification(
          theCase,
          user,
        ),
      ])
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

    const defendantsInCustody = await this.defendantModel.findAll({
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
    return this.defendantModel.findOne({
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
      await this.messageService.sendMessagesToQueue([
        this.getMessageForSendDefendantsNotUpdatedAtCourtNotification(
          theCase,
          user,
        ),
      ])

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
