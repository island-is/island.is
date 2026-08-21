import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentSubtype } from '../models/indictmentSubtype.model'

@Injectable()
export class IndictmentSubtypeRepositoryService {
  constructor(
    @InjectModel(IndictmentSubtype)
    private readonly indictmentSubtypeModel: typeof IndictmentSubtype,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findByArticle(
    article?: string | null,
  ): Promise<IndictmentSubtype | null> {
    try {
      this.logger.debug(`Finding the indictment subtype for article ${article}`)

      return await this.indictmentSubtypeModel.findOne({ where: { article } })
    } catch (error) {
      this.logger.error(
        `Error finding the indictment subtype for article ${article}:`,
        { error },
      )

      throw error
    }
  }
}
