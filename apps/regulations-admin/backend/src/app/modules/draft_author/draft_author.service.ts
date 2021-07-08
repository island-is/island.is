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

  getAll(): Promise<DraftAuthor[]> {
    this.logger.debug('Getting all DraftAuthors')

    return this.draftAuthorModel.findAll({
      order: ['name'],
      where: {
        active: true,
      },
      include: [{ model: DraftRegulation, as: 'draft_regulation' }],
    })
  }

  findById(id: string): Promise<DraftAuthor> {
    this.logger.debug(`Finding DraftAuthor ${id}`)

    return this.draftAuthorModel.findOne({
      where: { id },
      include: [{ model: DraftRegulation, as: 'draft_regulation' }],
    })
  }

  create(draftAuthorToCreate: CreateDraftAuthorDto): Promise<DraftAuthor> {
    this.logger.debug('Creating a new DraftAuthor')

    return this.draftAuthorModel.create(draftAuthorToCreate)
  }
}
