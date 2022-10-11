import {
  BasicDataProvider,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { VehiclesList } from '@island.is/api/schema'
import { queryVehicleList } from '../graphql/queries'
import * as Sentry from '@sentry/react'

interface VehicleListProps {
  vehiclesList: VehiclesList
}

export class VehicleListProvider extends BasicDataProvider {
  override type = 'VehicleListProvider'

  async queryVehicleList(): Promise<VehiclesList> {
    return this.useGraphqlGateway(queryVehicleList)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        return Promise.resolve(response.data.vehiclesList)
      })
      .catch((error) => this.handleError(error))
  }

  async provide(): Promise<VehicleListProps> {
    const vehiclesList = await this.queryVehicleList()
    // Maybe we should have an error if use does not have any vehicles.
    if (!vehiclesList) {
      return Promise.reject({
        reason: 'Error message',
      })
    }
    return {
      vehiclesList,
    }
  }

  override onProvideSuccess(vehiclesList: VehiclesList): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: vehiclesList,
      status: 'success',
    }
  }

  override onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
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
