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

    const countResult =
      (
        await this.vehiclesApiWithAuth(
          auth,
        ).currentvehicleswithmileageandinspGet({
          showOwned: showOwned,
          showCoowned: showCoOwned,
          showOperated: showOperated,
          page: 1,
          pageSize: 1,
        })
      ).totalRecords || 0
    if (countResult && countResult > 20) {
      return {
        totalRecords: countResult,
        vehicles: [],
      }
    }
    const result = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: showOwned,
      showCoowned: showCoOwned,
      showOperated: showOperated,
    })

    // // Validate that user has at least 1 vehicle
    if (!result || !result.length) {
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

    return {
      totalRecords: countResult,
      vehicles: result?.map((vehicle) => ({
        permno: vehicle.permno,
        make: vehicle.make,
        color: vehicle.color,
        role: vehicle.role,
      })),
    }
  }
}
