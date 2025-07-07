import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { lawyersModuleConfig } from './lawyers.config'
import { LawyerRegistryResponse, LawyerType } from './lawyers.types'
@Injectable()
export class LawyersService {
  constructor(
    @Inject(lawyersModuleConfig.KEY)
    private readonly config: ConfigType<typeof lawyersModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getLawyers(lawyerType?: LawyerType): Promise<LawyerRegistryResponse[]> {
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

  async getLawyer(nationalId: string): Promise<LawyerRegistryResponse> {
    const response = await fetch(
      `${this.config.lawyerRegistryAPI}/lawyer/${nationalId}`,
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
    this.logger.info('Failed to get lawyer from lawyer registry:', reason)

    if (response.status === 404) {
      throw new NotFoundException('Lawyer not found')
    }

    throw new Error(reason)
  }
}
