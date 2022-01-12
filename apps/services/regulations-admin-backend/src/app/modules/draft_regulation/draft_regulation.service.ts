import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { CreateDraftRegulationDto, UpdateDraftRegulationDto } from './dto'
import { DraftRegulation } from './draft_regulation.model'
import { DraftRegulationChange } from '../draft_regulation_change'
import { DraftRegulationCancel } from '../draft_regulation_cancel'
import { Op } from 'sequelize'
import { DraftRegulationCancelService } from '../draft_regulation_cancel/draft_regulation_cancel.service'
import { DraftRegulationChangeService } from '../draft_regulation_change/draft_regulation_change.service'

@Injectable()
export class DraftRegulationService {
  constructor(
    @InjectModel(DraftRegulation)
    private readonly draftRegulationModel: typeof DraftRegulation,
    private readonly draftRegulationCancelService: DraftRegulationCancelService,
    private readonly draftRegulationChangeService: DraftRegulationChangeService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(nationalId?: string): Promise<DraftRegulation[]> {
    this.logger.debug(
      'Getting all non shipped DraftRegulations, filtered by national id for non managers',
    )

    if (nationalId) {
      return this.draftRegulationModel.findAll({
        where: {
          drafting_status: { [Op.in]: ['draft', 'proposal'] },
          authors: { [Op.contains]: [nationalId] },
        },
        order: [
          ['drafting_status', 'ASC'],
          ['created', 'DESC'],
        ],
      })
    } else {
      return this.draftRegulationModel.findAll({
        where: {
          [Op.or]: [
            { drafting_status: 'draft' },
            { drafting_status: 'proposal' },
          ],
        },
        order: [
          ['drafting_status', 'ASC'],
          ['created', 'DESC'],
        ],
      })
    }
  }

  getAllShipped(): Promise<DraftRegulation[]> {
    this.logger.debug('Getting all shipped/published DraftRegulations')

    return this.draftRegulationModel.findAll({
      where: {
        drafting_status: { [Op.in]: ['shipped', 'published'] },
      },
      order: [['created', 'DESC']],
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
    create: CreateDraftRegulationDto,
    nationalId: string,
  ): Promise<DraftRegulation> {
    this.logger.debug('Creating a new DraftRegulation')

    create.authors = [nationalId]
    return this.draftRegulationModel.create(create)
  }

  async update(
    id: string,
    update: UpdateDraftRegulationDto,
    nationalId: string,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulation: DraftRegulation
  }> {
    this.logger.debug(`Updating DraftRegulation ${id}`)

    if (update.authors && !update.authors.includes(nationalId)) {
      update.authors.push(nationalId)
    }

    const [
      numberOfAffectedRows,
      [updatedDraftRegulation],
    ] = await this.draftRegulationModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedDraftRegulation }
  }

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulation ${id}`)

    // destroy all draft regulation impacts
    await this.draftRegulationCancelService.deleteRegulationDraftCancels(id)
    await this.draftRegulationChangeService.deleteRegulationDraftChanges(id)

    return this.draftRegulationModel.destroy({
      where: {
        id,
      },
    })
  }
}
