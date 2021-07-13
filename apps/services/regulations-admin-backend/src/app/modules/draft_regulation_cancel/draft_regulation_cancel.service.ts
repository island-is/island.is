import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import {
  CreateDraftRegulationCancelDto,
  UpdateDraftRegulationCancelDto,
} from './dto'
import { DraftRegulationCancel } from './draft_regulation_cancel.model'

@Injectable()
export class DraftRegulationCancelService {
  constructor(
    @InjectModel(DraftRegulationCancel)
    private readonly draftRegulationCancelModel: typeof DraftRegulationCancel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(
    draftRegulationcancelToCreate: CreateDraftRegulationCancelDto,
  ): Promise<DraftRegulationCancel> {
    this.logger.debug('Creating a new DraftRegulationcancel')

    return await this.draftRegulationCancelModel.create(
      draftRegulationcancelToCreate,
    )
  }

  async update(
    id: string,
    update: UpdateDraftRegulationCancelDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedDraftRegulationCancel: DraftRegulationCancel
  }> {
    this.logger.debug(`Updating DraftRegulationCancel ${id}`)

    const [
      numberOfAffectedRows,
      [updatedDraftRegulationCancel],
    ] = await this.draftRegulationCancelModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedDraftRegulationCancel }
  }

  async delete(id: string): Promise<number> {
    this.logger.debug(`Deleting DraftRegulationCancel ${id}`)

    return this.draftRegulationCancelModel.destroy({
      where: {
        id,
      },
    })
  }
}
