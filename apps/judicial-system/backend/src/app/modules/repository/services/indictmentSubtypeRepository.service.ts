import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { IndictmentSubtype } from '../models/indictmentSubtype.model'

const normalizeSubtypeMatchValue = (
  value?: string | null,
): string | undefined => {
  const normalized = value?.trim().toLowerCase()

  return normalized ? normalized : undefined
}

@Injectable()
export class IndictmentSubtypeRepositoryService {
  constructor(
    @InjectModel(IndictmentSubtype)
    private readonly indictmentSubtypeModel: typeof IndictmentSubtype,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async findByArticle(
    article?: string | null,
    details?: string | null,
  ): Promise<IndictmentSubtype | null> {
    try {
      this.logger.debug(
        `Finding the indictment subtype for article ${article}`,
      )

      const subtypes = await this.indictmentSubtypeModel.findAll({
        where: { article },
      })

      if (subtypes.length <= 1) {
        return subtypes[0] ?? null
      }

      const normalizedDetails = normalizeSubtypeMatchValue(details)

      if (!normalizedDetails) {
        return subtypes[0]
      }

      return (
        subtypes.find(
          (subtype) =>
            normalizeSubtypeMatchValue(subtype.details) === normalizedDetails,
        ) ?? subtypes[0]
      )
    } catch (error) {
      this.logger.error(
        `Error finding the indictment subtype for article ${article}:`,
        { error },
      )

      throw error
    }
  }
}
