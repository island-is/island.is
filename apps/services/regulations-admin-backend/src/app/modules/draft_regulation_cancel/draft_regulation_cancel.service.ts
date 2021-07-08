import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { CreateDraftRegulationCancelDto } from './dto'
import { DraftRegulationCancel } from './draft_regulation_cancel.model'

import { DraftRegulation } from '../draft_regulation/draft_regulation.model'

@Injectable()
export class DraftRegulationCancelService {
  constructor(
    @InjectModel(DraftRegulationCancel)
    private readonly draftRegulationcancelModel: typeof DraftRegulationCancel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  create(
    draftRegulationcancelToCreate: CreateDraftRegulationCancelDto,
  ): Promise<DraftRegulationCancel> {
    this.logger.debug('Creating a new DraftRegulationcancel')

    return this.draftRegulationcancelModel.create(draftRegulationcancelToCreate)
  }
}
