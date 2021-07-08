import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { CreateDraftRegulationDto, UpdateDraftRegulationDto } from './dto'
import { DraftRegulation } from './draft_regulation.model'
import { DraftRegulationChange } from '../draft_regulation_change'
import { DraftRegulationCancel } from '../draft_regulation_cancel'

@Injectable()
export class DraftRegulationService {
  constructor(
    @InjectModel(DraftRegulation)
    private readonly draftRegulationModel: typeof DraftRegulation,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(): Promise<DraftRegulation[]> {
    this.logger.debug('Getting all DraftRegulations')

    return this.draftRegulationModel.findAll({
      order: [
        ['drafting_status', 'ASC'],
        ['created', 'DESC'],
      ],
    })
  }

  findById(id: string): Promise<DraftRegulation> {
    this.logger.debug(`Finding DraftRegulation ${id}`)

    return this.draftRegulationModel.findOne({
      where: { id },
      include: [
        { model: DraftRegulationChange },
        { model: DraftRegulationCancel },
      ],
    })
  }

  create(
    draftRegulationToCreate: CreateDraftRegulationDto,
  ): Promise<DraftRegulation> {
    this.logger.debug('Creating a new DraftRegulation')

    return this.draftRegulationModel.create(draftRegulationToCreate)
  }

  async update(
    id: string,
    update: UpdateDraftRegulationDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulation: DraftRegulation
  }> {
    this.logger.debug(`Updating DraftRegulation ${id}`)

    const [
      numberOfAffectedRows,
      [updatedDraftRegulation],
    ] = await this.draftRegulationModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedDraftRegulation }
  }
}
