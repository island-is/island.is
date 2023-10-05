import fetch from 'isomorphic-fetch'

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Lawyer, mapToLawyer } from '@island.is/judicial-system/types'

import { defenderModuleConfig } from './defender.config'

@Injectable()
export class DefenderService {
  constructor(
    @Inject(defenderModuleConfig.KEY)
    private readonly config: ConfigType<typeof defenderModuleConfig>,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async getLawyers(): Promise<Lawyer[]> {
    const response = await fetch(`${this.config.lawyerRegistryAPI}/lawyers`, {
      headers: {
        Authorization: `Basic  ${this.config.lawyerRegistryAPIKey}`,
        Accept: 'application/json',
      },
    })

    if (response.ok) {
      const lawyers = await response.json()
      const lawyersMapped = (lawyers || []).map(mapToLawyer)
      return lawyersMapped
    }

    const reason = await response.text()
    this.logger.info('Failed to get lawyers from lawyer registry:', reason)
    throw new Error(reason)
  }

  async getLawyer(nationalId: string): Promise<Lawyer> {
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
      const lawyer = await response.json()
      const lawyerMapped = {
        ...mapToLawyer(lawyer),
      }
      return lawyerMapped
    }

    const reason = await response.text()
    this.logger.info('Failed to get lawyer from lawyer registry:', reason)
    throw new Error(reason)
  }
}
