import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { LawyerFull, LawyerRegistry } from '@island.is/judicial-system/types'

import { lawyersModuleConfig } from './lawyers.config'
import { LawyerType } from './lawyers.types'

@Injectable()
export class LawyersService {
  constructor(
    @Inject(lawyersModuleConfig.KEY)
    private readonly config: ConfigType<typeof lawyersModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getLawyersFromLFMI(lawyerType?: LawyerType): Promise<LawyerFull[]> {
    const response = await fetch(
      `${this.config.lawyerRegistryAPI}/lawyers${
        lawyerType && lawyerType === LawyerType.LITIGATORS ? '?verjendur=1' : ''
      }`,
      {
        headers: {
          Authorization: `Basic ${this.config.lawyerRegistryAPIKey}`,
          Accept: 'application/json',
        },
      },
    )

    if (response.ok) {
      return response.json()
    }

    const reason = await response.text()
    this.logger.info('Failed to get lawyers from lawyer registry:', reason)
    throw new Error(reason)
  }

  async getLawyers(lawyerType?: LawyerType): Promise<LawyerRegistry[]> {
    const response = await fetch(
      `${this.config.backendUrl}/lawyer-registry${
        lawyerType ? `?lawyer-type=${lawyerType}` : ''
      }`,
    )

    if (response.ok) {
      return response.json()
    }

    const reason = await response.text()
    this.logger.info('Failed to get lawyers from lawyer registry:', reason)
    throw new Error(reason)
  }

  async getLawyer(nationalId: string): Promise<LawyerRegistry> {
    const response = await fetch(
      `${this.config.backendUrl}/lawyer/${nationalId}`,
    )

    if (response.ok) {
      return response.json()
    }

    const reason = await response.text()
    this.logger.info('Failed to get lawyer from lawyer registry:', reason)

    if (response.status === 404) {
      throw new NotFoundException('Lawyer not found')
    }

    throw new Error(reason)
  }
}
