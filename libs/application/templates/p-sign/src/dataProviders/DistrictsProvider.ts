import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { DistrictCommissionerAgencies } from '../types/schema'
import { m } from '../lib/messages'

export class DistrictsProvider extends BasicDataProvider {
  type = 'DistrictsProvider'

  async provide(): Promise<DistrictCommissionerAgencies> {
    const query = `
        query getSyslumennDistrictCommissionersAgencies {
          getSyslumennDistrictCommissionersAgencies {
            name
            place
            address
            id
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
          response.data.getSyslumennDistrictCommissionersAgencies,
        )
      })
      .catch((error) => this.handleError(error))
  }

  handleError(_: any) {
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
