import { Inject, Injectable } from '@nestjs/common'

import {
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import {
  CarRecyclingClientService,
  RecyclingRequestTypes,
} from '@island.is/clients/car-recycling'
import {
  RecyclingFundClientService,
  CreateXRoadRecyclingRequestDtoRequestTypeEnum,
} from '@island.is/clients/recycling-fund'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

import {
  VehicleDto,
  getApplicationAnswers,
  getApplicationExternalData,
} from '@island.is/application/templates/car-recycling'
import { User } from '@island.is/auth-nest-tools'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

@Injectable()
export class CarRecyclingService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private carRecyclingService: CarRecyclingClientService,
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly recyclingFundService: RecyclingFundClientService,
  ) {
    super(ApplicationTypes.CAR_RECYCLING)
  }
  //THE SKILAVOTTORD BACKEND IS BEING MOVED TO THE RECYCLING FUND SERVERS FROM ISLAND.IS
  // TO BEGIN WITH WE ARE SAVING THE DATA ON BOTH SERVERS

  async createOwner(application: ApplicationWithAttachments, auth: User) {
    const { applicantName } = getApplicationExternalData(
      application.externalData,
    )
    // OLD BACKEND
    const oldResponse = await this.carRecyclingService.createOwner(
      auth,
      applicantName,
    )

    // New backend is only used in dev and local for now, to keep it from affecting real users while we test it out
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      await this.recyclingFundService.createOwner(auth, applicantName)
    }

    return oldResponse
  }

  async createVehicle(auth: User, vehicle: VehicleDto) {
    if (vehicle && vehicle.permno) {
      let mileage = 0
      let modelYear = null

      // If mileage is provided, convert it to a number and remove the dot
      if (vehicle.mileage) {
        mileage = +vehicle.mileage.trim().replace(/\./g, '')
      }

      // If no mileage is provided, use the latest mileage
      if (mileage === 0) {
        mileage = vehicle.latestMileage || 0
      }

      // Support the newRegistrationDate, for now, to keep backwards compatibility
      if (vehicle.newRegistrationDate) {
        modelYear = new Date(vehicle.newRegistrationDate)
      } else if (vehicle.modelYear) {
        modelYear = new Date(vehicle.modelYear, 0, 1)
      }

      // OLD Backend
      const oldResponse = await this.carRecyclingService.createVehicle(
        auth,
        vehicle.permno,
        mileage,
        vehicle.vin || '',
        vehicle.make || '',
        modelYear,
        vehicle.color || '',
      )

      // New backend is only used in dev and local for now, to keep it from affecting real users while we test it out
      if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
        await this.recyclingFundService.createVehicle(
          auth,
          vehicle.permno,
          mileage,
          vehicle.vin || '',
          vehicle.make || '',
          modelYear,
          vehicle.color || '',
        )
      }

      return oldResponse
    }
  }

  async recycleVehicle(
    auth: User,
    fullName: string,
    vehicle: VehicleDto,
    recyclingRequestType: RecyclingRequestTypes,
  ) {
    // OLD Backend
    const oldResponse = await this.carRecyclingService.recycleVehicle(
      auth,
      fullName.trim(),
      vehicle.permno || '',
      recyclingRequestType,
    )

    // New backend is only used in dev and local for now, to keep it from affecting real users while we test it out
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      await this.recyclingFundService.recycleVehicle(
        auth,
        fullName.trim(),
        vehicle.permno || '',
        recyclingRequestType === RecyclingRequestTypes.pendingRecycle
          ? CreateXRoadRecyclingRequestDtoRequestTypeEnum.PendingRecycle
          : CreateXRoadRecyclingRequestDtoRequestTypeEnum.Cancelled,
      )
    }
    return oldResponse
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
        this.logger.error(`car-recycling: Error creating owner`, {
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

          if (
            cancelResponse &&
            !cancelResponse.data.createSkilavottordRecyclingRequestAppSys.status
          ) {
            isError = true
            this.logger.error(
              `car-recycling: Error canceling recycling vehicle ${vehicle.permno?.slice(
                -3,
              )} `,
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
            this.logger.error(
              `car-recycling: Error creating vehicle ${vehicle.permno?.slice(
                -3,
              )} `,
              {
                error: vechicleResponse.errors,
              },
            )
          }

          if (!isError) {
            // Recycle vehicle
            const response = await this.recycleVehicle(
              auth,
              applicantName,
              vehicle,
              RecyclingRequestTypes.pendingRecycle,
            )

            if (
              response &&
              !response.data.createSkilavottordRecyclingRequestAppSys.status
            ) {
              isError = true
              this.logger.error(
                `car-recycling: Error recycling vehicle ${vehicle.permno?.slice(
                  -3,
                )}`,
                {
                  error: response.errors,
                },
              )
            }
          }
        }
      })

      // Wait for all promises to resolve or reject
      await Promise.all(vehiclesResponses)

      if (isError) {
        return Promise.reject(
          new Error(`car-recycling: Error occurred when recycling vehicle(s)`),
        )
      }

      return Promise.resolve(true)
    } catch (error) {
      isError = true
      this.logger.error(
        `car-recycling: Error occurred when recycling vehicle(s)`,
        {
          error,
        },
      )

      return Promise.reject(
        new Error(`Error occurred when recycling vehicle(s)`),
      )
    }
  }
}
