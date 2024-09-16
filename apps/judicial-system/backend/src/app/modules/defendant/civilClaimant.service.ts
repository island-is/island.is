import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Case } from '../case'
import { CreateCivilClaimantDto } from './dto/createCivilClaimant.dto'
import { UpdateCivilClaimantDto } from './dto/updateCivilClaimant.dto'
import { CivilClaimant } from './models/civilClaimant.model'

@Injectable()
export class CivilClaimantService {
  constructor(
    @InjectModel(CivilClaimant)
    private readonly civilClaimantModel: typeof CivilClaimant,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    theCase: Case,
    claimantToCreate: CreateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    return this.civilClaimantModel.create({
      ...claimantToCreate,
      caseId: theCase.id,
    })
  }

  async update(
    civilClaimantId: string,
    update: UpdateCivilClaimantDto,
  ): Promise<CivilClaimant> {
    const [numberOfAffectedRows, civilClaimants] =
      await this.civilClaimantModel.update(update, {
        where: {
          civilClaimantId,
        },
        returning: true,
      })

    if (numberOfAffectedRows > 1) {
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating civil claimant ${civilClaimantId} `,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new Error(`Could not update civil claimant ${civilClaimantId}`)
    }

    return civilClaimants[0]
  }

  async remove(civilClaimantId: string): Promise<void> {
    const numberOfAffectedRows = await this.civilClaimantModel.destroy({
      where: {
        civilClaimantId,
      },
    })

    if (numberOfAffectedRows < 1) {
      throw new Error(`Could not delete civil claimant ${civilClaimantId}`)
    }
  }
}
