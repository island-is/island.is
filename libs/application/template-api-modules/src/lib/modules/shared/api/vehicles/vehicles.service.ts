import { Injectable } from '@nestjs/common'
import { TemplateApiError } from '@island.is/nest/problem'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { coreErrorMessages } from '@island.is/application/core'
import { TemplateApiModuleActionProps } from '../../../../types'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { CurrentVehiclesParameters } from '@island.is/application/types'

@Injectable()
export class VehiclesService extends BaseTemplateApiService {
  constructor(private readonly vehiclesApi: VehicleSearchApi) {
    super('VehiclesShared')
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async currentVehicles({
    auth,
    params,
  }: TemplateApiModuleActionProps<CurrentVehiclesParameters>) {
    const showOwned = params?.showOwned || false
    const showCoOwned = params?.showCoOwned || false
    const showOperated = params?.showOperated || false

    // Get max 20 vehicles and total count of vehicles
    // Note: Should be enough to only get 20, because if totalRecords
    // is higher than 20, then we won't return any vehicles
    const result = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      showOwned: showOwned,
      showCoowned: showCoOwned,
      showOperated: showOperated,
      page: 1,
      pageSize: 20,
    })
    const totalRecords = result.totalRecords || 0

    // Validate that user has at least 1 vehicle
    if (!totalRecords) {
      if (showOwned && !showCoOwned && !showOperated) {
        // Throw error message that user is not the main owner of at least 1 vehicle
        throw new TemplateApiError(
          {
            title: coreErrorMessages.vehiclesEmptyListOwner,
            summary: coreErrorMessages.vehiclesEmptyListOwner,
          },
          400,
        )
      } else if (showOwned && showCoOwned && !showOperated) {
        // Throw error message that user is not the owner (either main owner or co-owner) of at least 1 vehicle
        throw new TemplateApiError(
          {
            title: coreErrorMessages.vehiclesEmptyListOwnerOrCoOwner,
            summary: coreErrorMessages.vehiclesEmptyListOwnerOrCoOwner,
          },
          400,
        )
      } else {
        // Throw generic error message that no vehicle was found
        throw new TemplateApiError(
          {
            title: coreErrorMessages.vehiclesEmptyListDefault,
            summary: coreErrorMessages.vehiclesEmptyListDefault,
          },
          400,
        )
      }
    }

    // Case: count > 20
    // Display search box, get vehicle basic info when permno is entered
    if (totalRecords > 20) {
      return {
        totalRecords: totalRecords,
        vehicles: [],
      }
    }

    const resultData = result.data || []

    // Case: count <= 20
    // Display dropdown or radio buttons, return all basic info now
    return {
      totalRecords: totalRecords,
      vehicles: resultData.map((vehicle) => ({
        permno: vehicle.permno || undefined,
        make: vehicle.make || undefined,
        color: vehicle.colorName || undefined,
        role: vehicle.role || undefined,
      })),
    }
  }
}
