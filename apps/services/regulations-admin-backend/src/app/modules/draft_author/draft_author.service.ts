import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { CreateDraftAuthorDto } from './dto'
import { DraftAuthor } from './draft_author.model'

import { DraftRegulation } from '../draft_regulation/draft_regulation.model'

@Injectable()
export class DraftAuthorService {
  constructor(
    @InjectModel(DraftAuthor)
    private readonly draftAuthorModel: typeof DraftAuthor,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  create(draftAuthorToCreate: CreateDraftAuthorDto): Promise<DraftAuthor> {
    this.logger.debug('Creating a new DraftAuthor')

    return this.draftAuthorModel.create(draftAuthorToCreate)
  }
}
