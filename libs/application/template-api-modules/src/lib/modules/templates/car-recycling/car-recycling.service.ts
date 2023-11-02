import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import { RecyclingFundClientService } from '@island.is/clients/recycling-fund'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

interface VMSTError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

@Injectable()
export class CarRecyclingService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private recyclingFundService: RecyclingFundClientService,
  ) {
    super(ApplicationTypes.CAR_RECYCLING)
  }

  private parseErrors(e: Error | VMSTError) {
    if (e instanceof Error) {
      return e.message
    }

    return {
      message: Object.entries(e.errors).map(([, values]) => values.join(', ')),
    }
  }

  async getVehicles({
    application,
    params = undefined,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const response = await this.recyclingFundService.getVehicles(auth)

      if (!response) {
        throw new Error(`Failed to get vehicles from: ${response}`)
      }
      return response
    } catch (e) {
      this.logger.error('Failed to vehicles', e)
      throw this.parseErrors(e)
    }
  }
}
