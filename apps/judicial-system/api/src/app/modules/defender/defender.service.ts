import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { type Lawyer } from '@island.is/judicial-system/types'

import { BackendService } from '../backend'

@Injectable()
export class DefenderService {
  constructor(
    private readonly backendService: BackendService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getLawyers(): Promise<Lawyer[]> {
    const lawyers = await this.backendService.getLawyers()

    if (lawyers.length > 0) {
      return lawyers
    }

    this.logger.info('Failed to get lawyers from lawyer registry')

    throw new NotFoundException('No lawyers found in the lawyer registry')
  }

  async getLawyer(nationalId: string): Promise<Lawyer> {
    const lawyer = await this.backendService.getLawyer(nationalId)

    if (lawyer) {
      return lawyer
    }

    this.logger.info('Failed to get lawyer from lawyer registry')

    throw new NotFoundException(
      'The lawyer with the given national id was not found',
    )
  }
}
