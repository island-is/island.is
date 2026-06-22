import { Op, Transaction } from 'sequelize'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  addMessagesToQueue,
  MessageType,
} from '@island.is/judicial-system/message'
import {
  CaseState,
  CivilClaimantNotificationType,
  type User,
} from '@island.is/judicial-system/types'

import { CourtService } from '../court'
import {
  Case,
  CaseDefendantPoliceCaseNumber,
  CivilClaimant,
} from '../repository'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { DeliverResponse } from './models/deliver.response'

@Injectable()
export class CivilClaimantService {
  constructor(
    @InjectModel(CivilClaimant)
    private readonly civilClaimantModel: typeof CivilClaimant,
    @InjectModel(CaseDefendantPoliceCaseNumber)
    private readonly caseDefendantPoliceCaseNumberModel: typeof CaseDefendantPoliceCaseNumber,
    private readonly courtService: CourtService,
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
    theCase: Case,
    oldCivilClaimant: CivilClaimant,
    updatedCivilClaimant: CivilClaimant,
    user: User,
  ): void {
    if (
      updatedCivilClaimant.isSpokespersonConfirmed &&
      !oldCivilClaimant.isSpokespersonConfirmed
    ) {
      if (theCase.courtCaseNumber) {
        addMessagesToQueue({
          type: MessageType.DELIVERY_TO_COURT_INDICTMENT_CIVIL_CLAIMANT,
          user,
          caseId: theCase.id,
          elementId: updatedCivilClaimant.id,
        })
      }

      addMessagesToQueue({
        type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
        caseId: updatedCivilClaimant.caseId,
        body: { type: CivilClaimantNotificationType.SPOKESPERSON_ASSIGNED },
        elementId: updatedCivilClaimant.id,
      })
      // send a notification to follow-up on scheduled court date
      addMessagesToQueue({
        type: MessageType.CIVIL_CLAIMANT_NOTIFICATION,
        caseId: updatedCivilClaimant.caseId,
        user,
        body: {
          type: CivilClaimantNotificationType.SPOKESPERSON_COURT_DATE_FOLLOW_UP,
        },
        elementId: updatedCivilClaimant.id,
      })
    }
  }

  private async filterDefendantIdsByPoliceCaseNumbers(
    caseId: string,
    policeCaseNumbers: string[],
    currentDefendantIds?: string[],
  ): Promise<string[]> {
    if (!currentDefendantIds?.length || !policeCaseNumbers.length) {
      return []
    }

    const validLinks = await this.caseDefendantPoliceCaseNumberModel.findAll({
      where: {
        caseId,
        policeCaseNumber: policeCaseNumbers,
        defendantId: currentDefendantIds,
      },
    })

    const validDefendantIds = new Set(
      validLinks
        .map((link) => link.defendantId)
        .filter((id): id is string => !!id),
    )

    return currentDefendantIds.filter((id) => validDefendantIds.has(id))
  }

  async update(
    theCase: Case,
    civilClaimant: CivilClaimant,
    update: UpdateCivilClaimantDto,
    user: User,
  ): Promise<CivilClaimant> {
    const caseId = theCase.id
    let effectiveUpdate = { ...update }

    if (
      update.policeCaseNumbers !== undefined ||
      update.defendantIds !== undefined
    ) {
      effectiveUpdate = {
        ...effectiveUpdate,
        defendantIds: await this.filterDefendantIdsByPoliceCaseNumbers(
          caseId,
          update.policeCaseNumbers ?? civilClaimant.policeCaseNumbers ?? [],
          update.defendantIds ?? civilClaimant.defendantIds,
        ),
      }
    }

    const [numberOfAffectedRows, civilClaimants] =
      await this.civilClaimantModel.update(effectiveUpdate, {
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
      theCase,
      civilClaimant,
      updatedCivilClaimant,
      user,
    )

    return updatedCivilClaimant
  }

  async deliverIndictmentCivilClaimantToCourt(
    theCase: Case,
    civilClaimant: CivilClaimant,
    user: User,
  ): Promise<DeliverResponse> {
    return this.courtService
      .updateIndictmentCaseWithSpokespersonInfo(
        user,
        theCase.id,
        theCase.court?.name,
        theCase.courtCaseNumber,
        civilClaimant.nationalId,
        civilClaimant.name,
        civilClaimant.spokespersonNationalId,
        civilClaimant.spokespersonIsLawyer,
      )
      .then(() => ({ delivered: true }))
      .catch((reason) => {
        this.logger.error(
          `Failed to update civil claimant info for civil claimant ${civilClaimant.id} of indictment case ${theCase.id}`,
          { reason },
        )

        return { delivered: false }
      })
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
        spokespersonNationalId: nationalId,
      },
      order: [['created', 'DESC']],
    })
  }
}
