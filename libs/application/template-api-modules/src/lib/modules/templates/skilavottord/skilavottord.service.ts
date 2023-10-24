import { Inject, Injectable } from '@nestjs/common'

import { GetVehiclesApi } from '@island.is/clients/skilavottord'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  ApplicationTypes,
} from '@island.is/application/types'

import {
  TemplateApiModuleActionProps,
} from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

interface VMSTError {
  type: string
  title: string
  status: number
  traceId: string
  errors: Record<string, string[]>
}

@Injectable()
export class SkilavottordService extends BaseTemplateApiService {

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private getVehiclesApi: GetVehiclesApi,
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
  }: TemplateApiModuleActionProps) {

    try {

      const response =
        await this.getVehiclesApi.applicationGetVehicles({nationalId:application.applicant})

      if (!response) {
        throw new Error(
          `Failed to send the parental leave application, no response.id from VMST API: ${response}`,
        )
      
      }
      return response
    } catch (e) {
      this.logger.error('Failed to send the parental leave application', e)
      throw this.parseErrors(e)
    }
  }
}
