import { CreateOptions, Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CaseArchive } from '../models/caseArchive.model'

interface CreateArchive {
  archive: string
}

interface CreateCaseArchiveOptions {
  transaction?: Transaction
}

@Injectable()
export class CaseArchiveRepositoryService {
  constructor(
    @InjectModel(CaseArchive)
    private readonly caseArchiveModel: typeof CaseArchive,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    data: CreateArchive,
    options?: CreateCaseArchiveOptions,
  ): Promise<CaseArchive> {
    try {
      this.logger.debug(
        `Creating a new case archive for case ${caseId} with data:`,
        { data: Object.keys(data) },
      )

      const createOptions: CreateOptions = {}

      if (options?.transaction) {
        createOptions.transaction = options.transaction
      }

      const result = await this.caseArchiveModel.create(
        { caseId, ...data },
        createOptions,
      )

      this.logger.debug(
        `Created a new case archive ${result.id} for case ${caseId}`,
      )

      return result
    } catch (error) {
      this.logger.error(
        `Error creating a new case archive for case ${caseId} with data:`,
        { data: Object.keys(data), error },
      )

      throw error
    }
  }
}
