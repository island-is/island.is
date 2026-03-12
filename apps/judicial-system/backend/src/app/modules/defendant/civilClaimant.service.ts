import { Op, Transaction } from 'sequelize'

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
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseState,
  CivilClaimantNotificationType,
} from '@island.is/judicial-system/types'

import { Case, CivilClaimant } from '../repository'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'

@Injectable()
export class CivilClaimantService {
  constructor(
    @InjectModel(CivilClaimant)
    private readonly civilClaimantModel: typeof CivilClaimant,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    theCase: Case,
    transaction: Transaction,
  ): Promise<CivilClaimant> {
    return this.civilClaimantModel.create(
      { caseId: theCase.id },
      { transaction },
    )
  }

  private addMessagesForUpdateCivilClaimantToQueue(
    oldCivilClaimant: CivilClaimant,
    updatedCivilClaimant: CivilClaimant,
  ): void {
    if (
      updatedCivilClaimant.isSpokespersonConfirmed &&
      !oldCivilClaimant.isSpokespersonConfirmed
    ) {
      addMessagesToQueue({
        type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
        caseId: updatedCivilClaimant.caseId,
        body: { type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED },
        elementId: updatedCivilClaimant.id,
      })
    }
  }

  async update(
    caseId: string,
    civilClaimant: CivilClaimant,
    update: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    const [numberOfAffectedRows, civilClaimants] =
      await this.civilClaimantModel.update(update, {
        where: { id: civilClaimant.id, caseId },
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

    this.addMessagesForUpdateCivilClaimantToQueue(
      civilClaimant,
      updatedCivilClaimant,
    )

    return updatedCivilClaimant
  }

  async delete(caseId: string, civilClaimantId: string): Promise<boolean> {
    const numberOfAffectedRows = await this.civilClaimantModel.destroy({
      where: {
        id: civilClaimantId,
        caseId,
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

  async deleteAll(caseId: string, transaction: Transaction): Promise<void> {
    await this.civilClaimantModel.destroy({
      where: { caseId },
      transaction,
    })
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
