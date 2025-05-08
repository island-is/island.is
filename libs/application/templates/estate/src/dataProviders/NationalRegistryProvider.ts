import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { NationalRegistryPerson } from '@island.is/api/schema'
import { DataProviderTypes } from '../lib/constants'

export class NationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry

  async provide(): Promise<NationalRegistryPerson> {
    const query = `
        query NationalRegistryUserQuery {
          nationalRegistryUserV2 {
            nationalId
            fullName
            address {
              streetName
              postalCode
              city
            }
          }
        }
      `

    return this.useGraphqlGateway<NationalRegistryPerson>(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        const returnObject: NationalRegistryPerson =
          response.data.nationalRegistryUserV2
        return Promise.resolve(returnObject)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }
  handleError(error: Error | unknown) {
    console.error('Provider.NationalRegistryProvider:', error)
    return Promise.reject('Failed to fetch national registry data')
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(
    result: NationalRegistryPerson,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
