import { Op } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
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
    oldCivilClaimant: CivilClaimant,
    updatedCivilClaimant: CivilClaimant,
  ): Promise<void> {
    if (
      updatedCivilClaimant.isSpokespersonConfirmed &&
      !oldCivilClaimant.isSpokespersonConfirmed
    ) {
      return this.messageService.sendMessagesToQueue([
        {
          type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
          caseId: updatedCivilClaimant.caseId,
          body: { type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED },
          elementId: updatedCivilClaimant.id,
        },
      ])
    }
  }

  async update(
    caseId: string,
    civilClaimant: CivilClaimant,
    update: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    const [numberOfAffectedRows, civilClaimants] =
      await this.civilClaimantModel.update(update, {
        where: {
          id: civilClaimant.id,
          caseId: caseId,
        },
        returning: true,
      })

    if (numberOfAffectedRows > 1) {
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating civil claimant ${civilClaimant.id} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update civil claimant ${civilClaimant.id} of case ${caseId}`,
      )
    }

    const updatedCivilClaimant = civilClaimants[0]

    await this.sendUpdateCivilClaimantMessages(
      civilClaimant,
      updatedCivilClaimant,
    )

    return updatedCivilClaimant
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
      throw new InternalServerErrorException(
        `Could not delete civil claimant ${civilClaimantId}`,
      )
    }

    return true
  }

  async deleteAll(caseId: string): Promise<boolean> {
    const numberOfAffectedRows = await this.civilClaimantModel.destroy({
      where: {
        caseId: caseId,
      },
    })

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when deleting all civil claimants in case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not delete all civil claimants in case ${caseId}`,
      )
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
