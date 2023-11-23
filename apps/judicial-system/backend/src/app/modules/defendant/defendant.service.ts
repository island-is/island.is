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

import {
  CaseMessage,
  MessageService,
  MessageType,
} from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import { CaseState, CaseType } from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { CourtService } from '../court'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { Defendant } from './models/defendant.model'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class DefendantService {
  constructor(
    @InjectModel(Defendant) private readonly defendantModel: typeof Defendant,
    private readonly courtService: CourtService,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private getMessageForSendDefendantsNotUpdatedAtCourtNotification(
    theCase: Case,
    user: User,
  ): CaseMessage {
    return {
      type: MessageType.SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION,
      user,
      caseId: theCase.id,
    }
  }

  private getMessageForDeliverDefendantToCourt(
    defendant: Defendant,
    user: User,
  ): CaseMessage {
    const message = {
      type: MessageType.DELIVER_DEFENDANT_TO_COURT,
      user,
      caseId: defendant.caseId,
      defendantId: defendant.id,
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
    user: User,
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

    if (theCase.courtCaseNumber) {
      // A defendant is updated after the case has been received by the court.
      if (updatedDefendant.noNationalId !== defendant.noNationalId) {
        // This should only happen to non-indictment cases.
        // A defendant nationalId is added or removed. Attempt to add the defendant to the court case.
        // In case there is no national id, the court will be notified.
        await this.messageService.sendMessagesToQueue([
          this.getMessageForDeliverDefendantToCourt(defendant, user),
        ])
      } else if (updatedDefendant.nationalId !== defendant.nationalId) {
        // This should only happen to non-indictment cases.
        // A defendant is replaced. Attempt to add the defendant to the court case,
        // but also ask the court to verify defendants.
        await this.messageService.sendMessagesToQueue([
          this.getMessageForSendDefendantsNotUpdatedAtCourtNotification(
            theCase,
            user,
          ),
          this.getMessageForDeliverDefendantToCourt(defendant, user),
        ])
      } else if (updatedDefendant.defenderEmail !== defendant.defenderEmail) {
        // This should only happen to indictment cases.
        // A defendant's defender email is updated.
        // Attempt to update the defendant in the court case.
        await this.messageService.sendMessagesToQueue([
          this.getMessageForDeliverDefendantToCourt(defendant, user),
        ])
      }
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
      where: { defenderNationalId: nationalId },
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
        const r = reason as Error
        r.message = r.message
          .replace(
            /Participant with id: \d{10}/g,
            'Participant with id: **********',
          )
          .replace(/\) gegn(.*?)'/g, ') gegn **********')

        this.logger.error('Failed to update case with defendant', { r })

        return { delivered: false }
      })
  }
}
