import {
  BasicDataProvider,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '@island.is/api/schema'
import { GET_CURRENT_VEHICLES } from '../graphql/queries'
import { externalData } from '../lib/messages'

export class CurrentVehiclesProvider extends BasicDataProvider {
  type = 'CurrentVehiclesProvider'

  async provide(): Promise<VehiclesCurrentVehicle[]> {
    return this.useGraphqlGateway(GET_CURRENT_VEHICLES, {
      input: {
        showOwned: true,
        showCoowned: true,
        showOperated: false,
      },
    }).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        return this.handleError(response.errors)
      }

      const result = response.data.currentVehicles

      // Validate that user has at least 1 vehicle he can order a vehicle registration for
      if (!result || !result.length) {
        return Promise.reject({
          reason: externalData.currentVehicles.empty.defaultMessage,
        })
      }

      return Promise.resolve(result)
    })
  }

  handleError(error: Error) {
    console.error(error)
    return Promise.reject({ reason: 'Failed to fetch data' })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  onProvideSuccess(
    result: VehiclesCurrentVehicle[],
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: result,
      status: 'success',
    }
  }
}
