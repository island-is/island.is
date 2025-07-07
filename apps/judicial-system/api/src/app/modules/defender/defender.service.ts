import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { type Lawyer, mapToLawyer } from '@island.is/judicial-system/types'

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
      const lawyersMapped = lawyers.map(mapToLawyer)

      return lawyersMapped
    }

    this.logger.info('Failed to get lawyers from lawyer registry')
    throw new Error()
  }

  async getLawyer(nationalId: string): Promise<Lawyer> {
    const lawyer = await this.backendService.getLawyer(nationalId)

    if (lawyer) {
      const lawyerMapped = {
        ...mapToLawyer(lawyer),
      }
      return lawyerMapped
    }

    this.logger.info('Failed to get lawyer from lawyer registry')
    throw new Error()
  }
}
