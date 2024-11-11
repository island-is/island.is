import { Op } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseState,
  CivilClaimantNotificationType,
} from '@island.is/judicial-system/types'

import { Case } from '../case/models/case.model'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { CivilClaimant } from './models/civilClaimant.model'

@Injectable()
export class CivilClaimantService {
  constructor(
    @InjectModel(CivilClaimant)
    private readonly civilClaimantModel: typeof CivilClaimant,
    private readonly messageService: MessageService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(theCase: Case): Promise<CivilClaimant> {
    return this.civilClaimantModel.create({
      caseId: theCase.id,
    })
  }

  private async sendUpdateCivilClaimantMessages(
    update: UpdateCivilClaimantDto,
    updatedCivilClaimant: CivilClaimant,
  ): Promise<void> {
    if (update.isSpokespersonConfirmed === true) {
      await this.messageService.sendMessagesToQueue([
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId: updatedCivilClaimant.caseId,
          body: {
            type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED,
          },
          elementId: updatedCivilClaimant.id,
        },
      ])
    }
  }

  async update(
    caseId: string,
    civilClaimantId: string,
    update: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    const [numberOfAffectedRows, civilClaimants] =
      await this.civilClaimantModel.update(update, {
        where: {
          id: civilClaimantId,
          caseId: caseId,
        },
        returning: true,
      })

    if (numberOfAffectedRows > 1) {
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating civil claimant ${civilClaimantId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new Error(`Could not update civil claimant ${civilClaimantId}`)
    }

    await this.sendUpdateCivilClaimantMessages(update, civilClaimants[0])

    return civilClaimants[0]
  }

  async delete(caseId: string, civilClaimantId: string): Promise<boolean> {
    const numberOfAffectedRows = await this.civilClaimantModel.destroy({
      where: {
        id: civilClaimantId,
        caseId: caseId,
      },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting civil claimant ${civilClaimantId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new Error(`Could not delete civil claimant ${civilClaimantId}`)
    }

    return true
  }

  findLatestClaimantBySpokespersonNationalId(
    nationalId: string,
  ): Promise<CivilClaimant | null> {
    return this.civilClaimantModel.findOne({
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
      where: {
        hasSpokesperson: true,
        spokespersonNationalId: normalizeAndFormatNationalId(nationalId),
      },
      order: [['created', 'DESC']],
    })
  }
}
