import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { CreateDraftRegulationChangeDto } from './dto'
import { DraftRegulationChange } from './draft_regulation_change.model'

import { DraftRegulation } from '../draft_regulation/draft_regulation.model'

@Injectable()
export class DraftRegulationChangeService {
  constructor(
    @InjectModel(DraftRegulationChange)
    private readonly draftRegulationChangeModel: typeof DraftRegulationChange,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(): Promise<DraftRegulationChange[]> {
    this.logger.debug('Getting all DraftRegulationChanges')

    return this.draftRegulationChangeModel.findAll({
      order: ['name'],
      where: {
        active: true,
      },
      include: [{ model: DraftRegulation, as: 'draft_regulation' }],
    })
  }

  findById(id: string): Promise<DraftRegulationChange> {
    this.logger.debug(`Finding DraftRegulationChange ${id}`)

    return this.draftRegulationChangeModel.findOne({
      where: { id },
      include: [{ model: DraftRegulation, as: 'draft_regulation' }],
    })
  }

  create(
    draftRegulationChangeToCreate: CreateDraftRegulationChangeDto,
  ): Promise<DraftRegulationChange> {
    this.logger.debug('Creating a new DraftRegulationChange')

    return this.draftRegulationChangeModel.create(draftRegulationChangeToCreate)
  }
}
