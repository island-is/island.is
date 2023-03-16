import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CreateDraftAuthorDto } from './dto'
import { DraftAuthorModel } from './draft_author.model'
import { Kennitala } from '@island.is/regulations'
import { Author } from '@island.is/regulations/admin'

@Injectable()
export class DraftAuthorService {
  constructor(
    @InjectModel(DraftAuthorModel)
    private readonly draftAuthorModel: typeof DraftAuthorModel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(
    draftAuthorToCreate: CreateDraftAuthorDto,
  ): Promise<DraftAuthorModel> {
    this.logger.debug('Creating a new DraftAuthor')

    return await this.draftAuthorModel.create({ ...draftAuthorToCreate })
  }

  async get(authorId: Kennitala): Promise<Author | null> {
    const author = await this.draftAuthorModel.findOne({
      where: { authorId },
    })

    this.logger.debug('Fetched DraftAuthor: ' + author)

    return author
  }
}
