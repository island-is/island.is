import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import {
  RecyclingFundClientService,
  RecyclingRequestTypes,
} from '@island.is/clients/recycling-fund'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  errorMessages,
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/car-recycling'
import { User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto } from '@island.is/clients/vehicles'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class CarRecyclingService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private recyclingFundService: RecyclingFundClientService,
  ) {
    super(ApplicationTypes.CAR_RECYCLING)
  }

  async getVehicles({ auth }: TemplateApiModuleActionProps) {
    try {
      const response = await this.recyclingFundService.createRecyclingRequest(
        auth,
      )

      /* if (!response) {
        throw new Error(`Failed to get vehicles from: ${response}`)
      }
      return response*/
    } catch (e) {
      this.logger.error('Failed to vehicles', e)
    }
  }

  async createOwner({ application, auth }: TemplateApiModuleActionProps) {
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    const response = await this.recyclingFundService.createOwner(
      auth,
      applicantName,
    )

    if (response.errors) {
      throw new TemplateApiError(
        {
          title: errorMessages.errorTitle,
          summary: errorMessages.createOwnerDescription,
        },
        500,
      )
    }
  }

  async createVehicle(auth: User, vehicle: VehicleMiniDto) {
    if (vehicle && vehicle.permno) {
      const response = await this.recyclingFundService.createVehicle(
        auth,
        vehicle.permno,
      )

      if (response.errors) {
        throw new TemplateApiError(
          {
            title: errorMessages.errorTitle,
            summary:
              errorMessages.createVehicleDescription + ' ' + vehicle.permno,
          },
          500,
        )
      }
    }
  }

  async recycleVehicles(
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
      if (response.errors) {
        throw new Error(vehicle.permno)
      }
    }
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { selectedVehicles, canceledVehicles } = getApplicationAnswers(
      application.answers,
    )
    try {
      selectedVehicles.forEach(async (vehicle) => {
        this.createVehicle(auth, vehicle)
        this.recycleVehicles(
          auth,
          vehicle,
          RecyclingRequestTypes.pendingRecycle,
        )
      })
    } catch (error) {
      throw new TemplateApiError(
        {
          title: errorMessages.errorTitle,
          summary: errorMessages.recycleVehicleDescription + ' ' + error,
        },
        500,
      )
    }
    try {
      canceledVehicles.forEach(async (vehicle) => {
        this.recycleVehicles(auth, vehicle, RecyclingRequestTypes.cancelled)
      })
    } catch (error) {
      throw new TemplateApiError(
        {
          title: errorMessages.errorTitle,
          summary: errorMessages.cancelRecycleVehicleDescription + ' ' + error,
        },
        500,
      )
    }
  }
}
