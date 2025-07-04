import { Inject, Injectable } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { type ConfigType } from '@island.is/nest/config'

import { LawyersService } from '@island.is/judicial-system/lawyers'
import { type Lawyer, mapToLawyer } from '@island.is/judicial-system/types'

import { defenderModuleConfig } from './defender.config'

@Injectable()
export class DefenderService {
  constructor(
    @Inject(defenderModuleConfig.KEY)
    private readonly config: ConfigType<typeof defenderModuleConfig>,
    private readonly lawyersService: LawyersService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getLawyers(): Promise<Lawyer[]> {
    const lawyers = await this.lawyersService.getLawyers()

    if (lawyers.length > 0) {
      const lawyersMapped = lawyers.map(mapToLawyer)
      return lawyersMapped
    }

    this.logger.info('Failed to get lawyers from lawyer registry')
    throw new Error()
  }

  async getLawyer(nationalId: string): Promise<Lawyer> {
    const lawyer = await this.lawyersService.getLawyer(nationalId)

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
