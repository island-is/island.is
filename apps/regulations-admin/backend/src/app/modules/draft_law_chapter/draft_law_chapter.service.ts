import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { environment } from '../../../environments'
import { CreateDraftLawChapterDto } from './dto'
import { DraftLawChapter } from './draft_law_chapter.model'

import { DraftRegulation } from '../draft_regulation/draft_regulation.model'

@Injectable()
export class DraftLawChapterService {
  constructor(
    @InjectModel(DraftLawChapter)
    private readonly draftLawChapterModel: typeof DraftLawChapter,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  getAll(): Promise<DraftLawChapter[]> {
    this.logger.debug('Getting all DraftLawChapters')

    return this.draftLawChapterModel.findAll({
      order: ['name'],
      include: [{ model: DraftRegulation }],
    })
  }

  findById(id: string): Promise<DraftLawChapter> {
    this.logger.debug(`Finding DraftLawChapter ${id}`)

    return this.draftLawChapterModel.findOne({
      where: { id },
      include: [{ model: DraftRegulation }],
    })
  }

  create(
    DraftLawChapterToCreate: CreateDraftLawChapterDto,
  ): Promise<DraftLawChapter> {
    this.logger.debug('Creating a new DraftLawChapter')

    return this.draftLawChapterModel.create(DraftLawChapterToCreate)
  }
}
