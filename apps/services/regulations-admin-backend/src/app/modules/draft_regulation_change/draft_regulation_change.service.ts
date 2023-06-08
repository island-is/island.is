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
import { RegQueryName, slugToName } from '@island.is/regulations'
import {
  DraftRegulationChange,
  DraftRegulationChangeId,
} from '@island.is/regulations/admin'

@Injectable()
export class DraftRegulationChangeService {
  constructor(
    @InjectModel(DraftRegulationChangeModel)
    private readonly draftRegulationChangeModel: typeof DraftRegulationChangeModel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(
    draftRegulationChangeToCreate: CreateDraftRegulationChangeDto,
  ): Promise<DraftRegulationChange> {
    this.logger.debug('Creating a new DraftRegulationChange')

    const createData: Partial<DraftRegulationChangeModel> = {
      changing_id: draftRegulationChangeToCreate.changingId,
      regulation: draftRegulationChangeToCreate.regulation,
      date: draftRegulationChangeToCreate.date,
      title: draftRegulationChangeToCreate.title,
      text: draftRegulationChangeToCreate.text,
      appendixes: draftRegulationChangeToCreate.appendixes,
      comments: draftRegulationChangeToCreate.comments,
      diff: draftRegulationChangeToCreate.diff,
    }

    const createResponce = await this.draftRegulationChangeModel.create(
      createData,
    )

    return {
      id: createResponce.id as DraftRegulationChangeId,
      changingId: createResponce.changing_id,
      type: 'amend',
      name: createResponce.regulation,
      regTitle: createResponce.regulation + ' - ' + createResponce.title,
      date: createResponce.date,
      title: createResponce.title,
      dropped: createResponce.dropped,
      text: createResponce.text,
      appendixes: createResponce.appendixes,
      comments: createResponce.comments,
      diff: createResponce.diff,
    }
  }

  async update(
    id: string,
    update: UpdateDraftRegulationChangeDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulationChange: DraftRegulationChange
  }> {
    this.logger.debug(`Updating DraftRegulationChange ${id}`)

    const [numberOfAffectedRows, [updateData]] =
      await this.draftRegulationChangeModel.update(update, {
        where: { id },
        returning: true,
      })

    const updatedDraftRegulationChange: DraftRegulationChange = {
      id: updateData.id as DraftRegulationChangeId,
      changingId: updateData.changing_id,
      type: 'amend',
      name: updateData.regulation,
      regTitle: updateData.regulation + ' - ' + updateData.title,
      date: updateData.date,
      title: updateData.title,
      dropped: updateData.dropped,
      text: updateData.text,
      appendixes: updateData.appendixes,
      comments: updateData.comments,
      diff: updateData.diff,
    }

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

  async findAllByName(
    regulation: RegQueryName,
  ): Promise<DraftRegulationChangeModel[]> {
    return this.draftRegulationChangeModel.findAll({
      where: {
        regulation: slugToName(regulation),
      },
    })
  }
}
