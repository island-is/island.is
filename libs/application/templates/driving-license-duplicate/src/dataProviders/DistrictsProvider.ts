import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { DistrictCommissionerAgencies } from '@island.is/api/schema'
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
          return Promise.reject({ reason: response.errors[0] })
        }

        return Promise.resolve(
          response.data.getSyslumennDistrictCommissionersAgencies,
        )
      })
      .catch((error) => Promise.reject({ reason: error }))
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
