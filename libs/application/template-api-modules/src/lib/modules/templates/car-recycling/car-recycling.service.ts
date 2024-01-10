import { Inject, Injectable } from '@nestjs/common'

import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  CarRecyclingClientService,
  RecyclingRequestTypes,
} from '@island.is/clients/car-recycling'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { coreErrorMessages } from '@island.is/application/core'

import {
  VehicleDto,
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/car-recycling'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class CarRecyclingService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private carRecyclingService: CarRecyclingClientService,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.CAR_RECYCLING)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehicles({ auth }: TemplateApiModuleActionProps) {
    const result = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: true,
      showOperated: true,
    })

    // Validate that user has at least 1 vehicle
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListDefault,
          summary: coreErrorMessages.vehiclesEmptyListDefault,
        },
        400,
      )
    }

    return result
  }

  async createOwner(application: ApplicationWithAttachments, auth: User) {
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    return await this.carRecyclingService.createOwner(auth, applicantName)
  }

  async createVehicle(auth: User, vehicle: VehicleDto) {
    if (vehicle && vehicle.permno) {
      let mileage = 0

      if (vehicle.mileage) {
        mileage = +vehicle.mileage.trim().replace(/\./g, '')
      }

      return await this.carRecyclingService.createVehicle(
        auth,
        vehicle.permno,
        mileage,
      )
    }
  }

  async recycleVehicle(
    auth: User,
    fullName: string,
    vehicle: VehicleDto,
    recyclingRequestType: RecyclingRequestTypes,
  ) {
    return await this.carRecyclingService.recycleVehicle(
      auth,
      fullName.trim(),
      vehicle.permno || '',
      recyclingRequestType,
    )
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { selectedVehicles, canceledVehicles } = getApplicationAnswers(
      application.answers,
    )

    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )

    let isError = false
    try {
      // Create owner
      const ownerResponse = await this.createOwner(application, auth)

      if (ownerResponse && ownerResponse.errors) {
        isError = true
        this.logger.error(`Error create owner ${applicantName}`, {
          error: ownerResponse.errors,
        })
      }

      // Canceled recycling
      const canceledResponses = canceledVehicles.map(async (vehicle) => {
        if (!isError) {
          const cancelResponse = await this.recycleVehicle(
            auth,
            applicantName,
            vehicle,
            RecyclingRequestTypes.cancelled,
          )

          if (cancelResponse && cancelResponse.errors) {
            isError = true
            this.logger.error(
              `Error canceling recycling vehicle ${vehicle.permno} `,
              {
                error: cancelResponse.errors,
              },
            )
          }
        }
      })

      // Wait for cancel to finish before continuing
      await Promise.all(canceledResponses)

      // Recycle
      const vehiclesResponses = selectedVehicles.map(async (vehicle) => {
        if (!isError) {
          // Create vehicle
          const vechicleResponse = await this.createVehicle(auth, vehicle)

          if (vechicleResponse && vechicleResponse.errors) {
            isError = true
            this.logger.error(`Error creating vehicle ${vehicle.permno} `, {
              error: vechicleResponse.errors,
            })
          }

          if (!isError) {
            // Recycle vehicle
            const response = await this.recycleVehicle(
              auth,
              applicantName,
              vehicle,
              RecyclingRequestTypes.pendingRecycle,
            )

            if (response && response.errors) {
              isError = true
              this.logger.error(`Error recycling vehicle ${vehicle.permno}`, {
                error: response.errors,
              })
            }
          }
        }
      })

      // Wait for all promises to resolve or reject
      await Promise.all(vehiclesResponses)

      if (isError) {
        return Promise.reject(
          new Error(
            `Error occurred when recycling vehicle(s) for ${applicantName}`,
          ),
        )
      }

      return Promise.resolve(true)
    } catch (error) {
      isError = true
      this.logger.error(
        `Error occurred when recycling vehicle(s) for ${applicantName}`,
        {
          error,
        },
      )
    }
  }
}
