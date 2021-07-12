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

@Injectable()
export class DraftRegulationService {
  constructor(
    @InjectModel(DraftRegulation)
    private readonly draftRegulationModel: typeof DraftRegulation,
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
          [Op.or]: [
            { drafting_status: 'draft' },
            { drafting_status: 'proposal' },
          ],
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
    this.logger.debug('Getting all shipped DraftRegulations')

    return this.draftRegulationModel.findAll({
      where: { drafting_status: 'shipped' },
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

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulation ${id}`)

    return this.draftRegulationModel.destroy({
      where: {
        id,
      },
    })
  }
}
