import { Inject, Injectable } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

import { CreateCaseDto } from './app.dto'
import { Case } from './app.model'

@Injectable()
export class AppService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async create(caseToCreate: CreateCaseDto): Promise<Case> {
    this.logger.info('Creating a new case', caseToCreate)

    return { id: 'DummyId' }
  }
}
