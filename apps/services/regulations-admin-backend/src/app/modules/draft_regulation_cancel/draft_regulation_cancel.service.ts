import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import {
  CreateDraftRegulationCancelDto,
  UpdateDraftRegulationCancelDto,
} from './dto'
import { DraftRegulationCancelModel } from './draft_regulation_cancel.model'
import { RegulationsService } from '@island.is/clients/regulations'
import {
  DraftRegulationCancel,
  DraftRegulationCancelId,
} from '@island.is/regulations/admin'
import { RegulationViewTypes } from '@island.is/regulations/web'
import { nameToSlug, RegQueryName, slugToName } from '@island.is/regulations'

@Injectable()
export class DraftRegulationCancelService {
  constructor(
    @InjectModel(DraftRegulationCancelModel)
    private readonly draftRegulationCancelModel: typeof DraftRegulationCancelModel,
    private readonly regulationsService: RegulationsService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async transformCancel(draftRegulationcancel: DraftRegulationCancelModel) {
    const regulation = await this.regulationsService.getRegulation(
      RegulationViewTypes.current,
      nameToSlug(draftRegulationcancel.regulation),
    )

    const draftRegulationCancel: DraftRegulationCancel = {
      type: 'repeal',
      name: draftRegulationcancel.regulation,
      regTitle: regulation?.title ?? '',
      id: draftRegulationcancel.id as DraftRegulationCancelId,
      date: draftRegulationcancel.date,
    }

    return draftRegulationCancel
  }

  async create(
    draftRegulationcancelToCreate: CreateDraftRegulationCancelDto,
  ): Promise<DraftRegulationCancel> {
    this.logger.debug('Creating a new DraftRegulationcancel')

    const createData: Partial<DraftRegulationCancelModel> = {
      changing_id: draftRegulationcancelToCreate.changingId,
      regulation: draftRegulationcancelToCreate.regulation,
      date: draftRegulationcancelToCreate.date,
    }

    const createdDraftRegulationCancel =
      await this.draftRegulationCancelModel.create(createData)

    return await this.transformCancel(createdDraftRegulationCancel)
  }

  async update(
    id: string,
    update: UpdateDraftRegulationCancelDto,
  ): Promise<{
    numberOfAffectedRows: number
    draftRegulationCancel: DraftRegulationCancel
  }> {
    this.logger.debug(`Updating DraftRegulationCancel ${id}`)

    const [numberOfAffectedRows, [updatedDraftRegulationCancel]] =
      await this.draftRegulationCancelModel.update(update, {
        where: { id },
        returning: true,
      })

    const draftRegulationCancel = await this.transformCancel(
      updatedDraftRegulationCancel,
    )

    return { numberOfAffectedRows, draftRegulationCancel }
  }

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulationCancel ${id}`)

    return this.draftRegulationCancelModel.destroy({
      where: {
        id,
      },
    })
  }

  async deleteRegulationDraftCancels(draftId: string): Promise<number> {
    this.logger.debug(`Deleting RegulationDraftCancels for: ${draftId}`)

    return this.draftRegulationCancelModel.destroy({
      where: {
        changing_id: draftId,
      },
    })
  }

  async findAllByName(
    regulation: string,
  ): Promise<DraftRegulationCancelModel[]> {
    return this.draftRegulationCancelModel.findAll({
      where: {
        regulation: slugToName(regulation as RegQueryName),
      },
    })
  }
}
