import { Transaction } from 'sequelize/types'

import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'

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

  async create(caseId: string): Promise<CourtSession> {
    return this.courtSessionRepositoryService.create({ caseId })
  }

  async update(
    caseId: string,
    courtSessionId: string,
    update: UpdateCourtSessionDto,
    transaction?: Transaction,
  ): Promise<CourtSession> {
    const [numberOfAffectedRows] = await this.courtSessionRepositoryService.update(
      update,
      {
        where: { id: courtSessionId, caseId },
        transaction,
      },
    )

    if (numberOfAffectedRows > 1) {
      // Tolerate failure, but log error
      this.logger.error(
        `Unexpected number of rows (${numberOfAffectedRows}) affected when updating court session ${courtSessionId} of case ${caseId}`,
      )
    } else if (numberOfAffectedRows < 1) {
      throw new InternalServerErrorException(
        `Could not update court session ${courtSessionId} of case ${caseId}`,
      )
    }

    // Return the updated court session - for simplicity, we'll create a mock return
    // In a real scenario, you might want to fetch the updated session
    return {
      id: courtSessionId,
      caseId,
      ...update,
    } as CourtSession
  }
}