import { Transaction } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { CourtSession, CourtSessionRepositoryService } from '../repository'
import { UpdateCourtSessionDto } from './dto/updateCourtSession.dto'

@Injectable()
export class CourtSessionService {
  constructor(
    private readonly courtSessionRepositoryService: CourtSessionRepositoryService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(
    caseId: string,
    transaction?: Transaction,
  ): Promise<CourtSession> {
    return this.courtSessionRepositoryService.create(caseId, { transaction })
  }

  async update(
    caseId: string,
    courtSessionId: string,
    update: UpdateCourtSessionDto,
    transaction?: Transaction,
  ): Promise<CourtSession> {
    return this.courtSessionRepositoryService.update(
      caseId,
      courtSessionId,
      update,
      { transaction },
    )
  }

  async delete(
    caseId: string,
    courtSessionId: string,
    transaction: Transaction,
  ): Promise<boolean> {
    await this.courtSessionRepositoryService.delete(caseId, courtSessionId, {
      transaction,
    })

    return true
  }
}
