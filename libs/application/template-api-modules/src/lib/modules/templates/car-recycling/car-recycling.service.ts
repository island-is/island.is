import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import {
  RecyclingFundClientService,
  RecyclingRequestTypes,
} from '@island.is/clients/recycling-fund'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/car-recycling'
import { User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto } from '@island.is/clients/vehicles'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'

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
      console.log('getVehicles')

      const response = await this.recyclingFundService.createRecyclingRequest(
        auth,
      )

      /* if (!response) {
        throw new Error(`Failed to get vehicles from: ${response}`)
      }
      return response*/
    } catch (e) {
      this.logger.error('Failed to vehicles', e)
      throw this.parseErrors(e)
    }
  }

  async createOwner({
    application,
    params = undefined,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const { applicantName } = getApplicationExternalData(
        application.externalData,
      )
      console.log('application', application)
      const response = await this.recyclingFundService.createOwner(
        auth,
        applicantName,
      )

      /* if (!response) {
        throw new Error(`Failed to create owner: ${response}`)
      }
      return response*/
    } catch (e) {
      throw new TemplateApiError(
        {
          title: 'messages.serviceErrors.createOwner.title',
          summary: 'messages.serviceErrors.createApplication.summary',
        },
        500,
      )
      this.logger.error('Failed to create owner', e)
      throw this.parseErrors(e)
    }
  }

  private async createVehicle(auth: User, vehicle: VehicleMiniDto) {
    if (vehicle && vehicle.permno) {
      const response = await this.recyclingFundService.createVehicle(
        auth,
        vehicle.permno,
      )

      if (!response) {
        throw new Error(
          `Failed to create vechicle: ${JSON.stringify(
            vehicle,
          )} - ${JSON.stringify(response)} `,
        )
      }
    }
  }

  private async recycleVehicles(
    auth: User,
    vehicle: VehicleMiniDto,
    recyclingRequestType: RecyclingRequestTypes,
  ) {
    if (vehicle && vehicle.permno) {
      const response = await this.recyclingFundService.recycleVehicle(
        auth,
        vehicle.permno,
        recyclingRequestType,
      )

      if (!response) {
        throw new Error(`Failed to recycle vehicle:  ${vehicle} -  ${response}`)
      }
    }
  }

  async sendApplication({
    application,
    params = undefined,
    auth,
  }: TemplateApiModuleActionProps) {
    try {
      const { selectedVehicles, canceledVehicles } = getApplicationAnswers(
        application.answers,
      )

      selectedVehicles.forEach(async (vehicle) => {
        // this.createVehicle(auth, vehicle)
        this.recycleVehicles(
          auth,
          vehicle,
          RecyclingRequestTypes.pendingRecycle,
        )
      })

      canceledVehicles.forEach(async (vehicle) => {
        this.recycleVehicles(auth, vehicle, RecyclingRequestTypes.cancelled)
      })

      return true
    } catch (e) {
      throw new TemplateApiError(
        {
          title: 'messages.serviceErrors.createApplication.title',
          summary: 'messages.serviceErrors.createApplication.summary',
        },
        500,
      )

      this.logger.error('Failed to send application ${application.id}', e)
      throw this.parseErrors(e)
    }
  }
}
