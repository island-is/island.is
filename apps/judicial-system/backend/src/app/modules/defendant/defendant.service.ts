import { Op, literal } from 'sequelize'
import { Transaction } from 'sequelize/types'
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CaseState,
  CaseType,
  isIndictmentCase,
  User as TUser,
} from '@island.is/judicial-system/types'
import {
  CaseMessage,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'

import { User } from '../user'
import { CourtService } from '../court'
import { Case } from '../case/models/case.model'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { DeliverResponse } from './models/deliver.response'
import { Defendant } from './models/defendant.model'

@Injectable()
export class DefendantService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    private readonly courtService: CourtService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getMessagesForSendDefendantsNotUpdatedAtCourtNotification(
    caseId: string,
    userId: string,
  ): CaseMessage {
    return {
      type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
      caseId,
      userId,
    }
  }

  private getMessageForDeliverDefendantToCourt(
    defendant: Defendant,
    user: TUser,
  ): CaseMessage {
    const message = {
      type: MessageType.DELIVER_DEFENDANT_TO_COURT,
      caseId: defendant.caseId,
      defendantId: defendant.id,
      userId: user.id,
    }

    return message
  }

  private getUpdatedDefendant(
    numberOfAffectedRows: number,
    defendants: Defendant[],
    defendantId: string,
    caseId: string,
  ): Defendant {
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
    user: TUser,
  ): Promise<Defendant> {
    const defendant = await this.defendantModel.create({
      ...defendantToCreate,
      caseId: theCase.id,
    })

    if (!isIndictmentCase(theCase.type) && theCase.courtCaseNumber) {
      // A defendant is added after the case has been received by the court.
      // Attempt to add the new defendant, but also ask the court to verify defendants.
      await this.messageService.sendMessagesToQueue([
        this.getMessagesForSendDefendantsNotUpdatedAtCourtNotification(
          theCase.id,
          user.id,
        ),
        this.getMessageForDeliverDefendantToCourt(defendant, user),
      ])
    }

    return defendant
  }

  async updateForArcive(
    caseId: string,
    defendantId: string,
    update: UpdateDefendantDto,
    transaction: Transaction,
  ): Promise<Defendant> {
    const [numberOfAffectedRows, defendants] = await this.defendantModel.update(
      update,
      {
        where: { id: defendantId, caseId },
        returning: true,
        transaction,
      },
    )

    return this.getUpdatedDefendant(
      numberOfAffectedRows,
      defendants,
      defendantId,
      caseId,
    )
  }

  async update(
    theCase: Case,
    defendant: Defendant,
    update: UpdateDefendantDto,
    user: TUser,
  ): Promise<Defendant> {
    const [numberOfAffectedRows, defendants] = await this.defendantModel.update(
      update,
      {
        where: { id: defendant.id, caseId: theCase.id },
        returning: true,
      },
    )

    const updatedDefendant = this.getUpdatedDefendant(
      numberOfAffectedRows,
      defendants,
      defendant.id,
      theCase.id,
    )

    if (
      !isIndictmentCase(theCase.type) &&
      theCase.courtCaseNumber &&
      (updatedDefendant.noNationalId !== defendant.noNationalId ||
        updatedDefendant.nationalId !== defendant.nationalId)
    ) {
      // A defendant is replaced after the case has been received by the court.
      // Attempt to add the new defendant, but also ask the court to verify defendants.
      await this.messageService.sendMessagesToQueue([
        this.getMessagesForSendDefendantsNotUpdatedAtCourtNotification(
          theCase.id,
          user.id,
        ),
        this.getMessageForDeliverDefendantToCourt(defendant, user),
      ])
    }

    return updatedDefendant
  }

  async delete(
    theCase: Case,
    defendantId: string,
    user: TUser,
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

    if (!isIndictmentCase(theCase.type) && theCase.courtCaseNumber) {
      // A defendant is removed after the case has been received by the court.
      // Ask the court to verify defendants.
      await this.messageService.sendMessagesToQueue([
        this.getMessagesForSendDefendantsNotUpdatedAtCourtNotification(
          theCase.id,
          user.id,
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

  async deliverDefendantToCourt(
    theCase: Case,
    defendant: Defendant,
    user: User,
  ): Promise<DeliverResponse> {
    if (
      defendant.noNationalId ||
      !defendant.nationalId ||
      defendant.nationalId.replace('-', '').length !== 10
    ) {
      await this.messageService.sendMessagesToQueue([
        this.getMessagesForSendDefendantsNotUpdatedAtCourtNotification(
          theCase.id,
          user.id,
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
}
