import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { Vehicle } from '../types'
import { m } from '../lib/messages'

export class VehicleProvider extends BasicDataProvider {
  type = 'VehicleProvider'

  async provide(): Promise<Array<Vehicle>> {
    // TODO implement from external client
    return Promise.resolve([
      { plateNumber: 'AB123', numberOfWheels: 4, weight: 1234, year: 2010 },
      { plateNumber: 'BEAN', numberOfWheels: 3, weight: 700, year: 1990 },
    ])

    /*
    const query = `
      query GetVehiclesQuery($input: GetMultiVehicleInput!) {
        getVehicles(input: $input) {
          vehicleNumber
          address
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }

        return Promise.resolve(
          response.data.getVehicles,
        )
      })
      .catch((error) => this.handleError(error))
    */
  }

  handleError(error: any) {
    return Promise.reject({})
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
