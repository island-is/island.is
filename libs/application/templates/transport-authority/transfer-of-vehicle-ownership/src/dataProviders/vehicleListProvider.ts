import {
  BasicDataProvider,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '@island.is/api/schema'
import { GET_CURRENT_VEHICLES } from '../graphql/queries'
import * as Sentry from '@sentry/react'
export class VehicleListProvider extends BasicDataProvider {
  type = 'VehicleListProvider'

  async queryVehicleList(): Promise<VehiclesCurrentVehicle[]> {
    return this.useGraphqlGateway(GET_CURRENT_VEHICLES, {
      input: {
        showOwned: true,
        showCoowned: false,
        showOperated: false,
      },
    })
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        return Promise.resolve(response.data.currentVehicles)
      })
      .catch((error) => this.handleError(error))
  }

  async provide(): Promise<VehiclesCurrentVehicle[]> {
    const result = await this.queryVehicleList()

    // Maybe we should have an error if use does not have any vehicles.
    if (!result) {
      return Promise.reject({
        reason: 'Error message',
      })
    }

    return result
  }

  onProvideSuccess(
    vehicleList: VehiclesCurrentVehicle[],
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: vehicleList,
      status: 'success',
    }
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  handleError(error: Error | unknown) {
    Sentry.captureException(error)
    return Promise.reject('Failed to fetch data')
  }
}
