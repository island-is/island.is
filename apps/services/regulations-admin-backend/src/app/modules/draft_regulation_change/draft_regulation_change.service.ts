import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import {
  CreateDraftRegulationChangeDto,
  UpdateDraftRegulationChangeDto,
} from './dto'
import { DraftRegulationChangeModel } from './draft_regulation_change.model'

@Injectable()
export class DraftRegulationChangeService {
  constructor(
    @InjectModel(DraftRegulationChangeModel)
    private readonly draftRegulationChangeModel: typeof DraftRegulationChangeModel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  create(
    draftRegulationChangeToCreate: CreateDraftRegulationChangeDto,
  ): Promise<DraftRegulationChangeModel> {
    this.logger.debug('Creating a new DraftRegulationChange')

    return this.draftRegulationChangeModel.create(draftRegulationChangeToCreate)
  }

  async update(
    id: string,
    update: UpdateDraftRegulationChangeDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulationChange: DraftRegulationChangeModel
  }> {
    this.logger.debug(`Updating DraftRegulationChange ${id}`)

    const [
      numberOfAffectedRows,
      [updatedDraftRegulationChange],
    ] = await this.draftRegulationChangeModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedDraftRegulationChange }
  }

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulationChange ${id}`)

    return this.draftRegulationChangeModel.destroy({
      where: {
        id,
      },
    })
  }

  async deleteRegulationDraftChanges(changingId: string): Promise<number> {
    this.logger.debug(`Deleting RegulationDraftCancels for: ${changingId}`)

    return this.draftRegulationChangeModel.destroy({
      where: {
        changing_id: changingId,
      },
    })
  }
}
