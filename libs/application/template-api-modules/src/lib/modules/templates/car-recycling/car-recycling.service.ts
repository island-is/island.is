import { Inject, Injectable } from '@nestjs/common'

import { ApplicationTypes } from '@island.is/application/types'
import {
  CarRecyclingClientService,
  RecyclingRequestTypes,
} from '@island.is/clients/car-recycling'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  errorMessages,
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/car-recycling'
import { User } from '@island.is/auth-nest-tools'
import { VehicleMiniDto } from '@island.is/clients/vehicles'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class CarRecyclingService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private carRecyclingService: CarRecyclingClientService,
  ) {
    super(ApplicationTypes.CAR_RECYCLING)
  }

  async createOwner({ application, auth }: TemplateApiModuleActionProps) {
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    const response = await this.carRecyclingService.createOwner(
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
      return await this.carRecyclingService.createVehicle(auth, vehicle.permno)
    }
  }

  async recycleVehicles(
    auth: User,
    vehicle: VehicleMiniDto,
    recyclingRequestType: RecyclingRequestTypes,
  ) {
    if (vehicle && vehicle.permno) {
      return await this.carRecyclingService.recycleVehicle(
        auth,
        vehicle.permno,
        recyclingRequestType,
      )
    }
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { selectedVehicles, canceledVehicles } = getApplicationAnswers(
      application.answers,
    )

    let isError = false
    try {
      selectedVehicles.forEach(async (vehicle) => {
        if (!isError) {
          // Create vehicle
          const vechicleResponse = await this.createVehicle(auth, vehicle)

          if (vechicleResponse && vechicleResponse.errors) {
            isError = true
            this.logger.error(vechicleResponse.errors)
          }

          if (!isError) {
            // Recycle vehicle
            const response = await this.recycleVehicles(
              auth,
              vehicle,
              RecyclingRequestTypes.pendingRecycle,
            )

            if (response && response.errors) {
              isError = true
              this.logger.error(response.errors)
            }
          }
        }
      })
    } catch (error) {
      isError = true
      this.logger.error(error.messages)
    }
    try {
      canceledVehicles.forEach(async (vehicle) => {
        // Cancel recycling
        this.recycleVehicles(auth, vehicle, RecyclingRequestTypes.cancelled)
      })
    } catch (error) {
      isError = true
      this.logger.error(error.messages)
    }

    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation (e.g., fetching data)
      setTimeout(() => {
        if (isError) {
          reject(new Error('Error occurred when recycling the vehicle'))
        } else {
          resolve(true)
        }
      }, 1000)
    })
  }
}
