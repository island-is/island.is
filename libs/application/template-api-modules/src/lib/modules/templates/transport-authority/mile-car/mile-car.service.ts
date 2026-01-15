import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { ApplicationTypes } from '@island.is/application/types'
import { NotificationsService } from '../../../../notification/notifications.service'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../../types'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { TemplateApiError } from '@island.is/nest/problem'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'

@Injectable()
export class MileCarService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly notificationsService: NotificationsService,
    private readonly vehiclesApi: VehicleSearchApi,
    private readonly mileageReadingApi: MileageReadingApi,
  ) {
    super(ApplicationTypes.MILE_CAR)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mileageReadingApiWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehiclesWithMileCar({ auth }: TemplateApiModuleActionProps) {
    // Get max 20 vehicles and total count of vehicles
    // Note: Should be enough to only get 20, because if totalRecords
    // is higher than 20, then we won't return any vehicles
    const result = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      showOwned: true,
      showCoowned: true,
      showOperated: true,
      page: 1,
      pageSize: 20,
    })
    const totalRecords = result.totalRecords || 0

    // Validate that user has at least 1 vehicle
    if (!totalRecords) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListOwnerOrCoOwner,
          summary: coreErrorMessages.vehiclesEmptyListOwnerOrCoOwner,
        },
        400,
      )
    }

    // Case: count >= 20
    // Display search box, validate vehicle when permno is entered
    if (totalRecords >= 20) {
      return {
        totalRecords: totalRecords,
        vehicles: [],
      }
    }

    const resultData = result.data || []

    if (totalRecords < 20) {
      const vehicles = resultData
        .filter((x) => !x.vehicleHasMilesOdometer)
        .map((vehicle) => {
          return {
            permno: vehicle.permno || undefined,
            make: vehicle.make || undefined,
            color: vehicle.colorName || undefined,
            role: vehicle.role || undefined,
            vehicleHasMilesOdometer:
              vehicle.vehicleHasMilesOdometer || undefined,
          }
        })

      return {
        totalRecords: totalRecords,
        vehicles: vehicles,
      }
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const permno =
      getValueViaPath<string>(application.answers, 'pickVehicle.plate') || ''

    return await this.mileageReadingApiWithAuth(auth).setVehicleOdometerAsMiles(
      {
        permno: permno,
      },
    )
  }
}
