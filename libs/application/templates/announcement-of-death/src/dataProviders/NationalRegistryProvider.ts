import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { DataProviderTypes, NationalRegistry } from '../types/index'

export class NationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry

  async provide(): Promise<NationalRegistry> {
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
            children {
              nationalId
              fullName
              livesWithApplicant
              livesWithBothParents
              otherParent {
                nationalId
                fullName
                address {
                  streetName
                  postalCode
                  city
                }
              }
            }
            spouse {
                nationalId
                name
            }
          }
        }
      `

    return this.useGraphqlGateway<NationalRegistry>(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        const returnObject: NationalRegistry =
          response.data.nationalRegistryUserV2
        return Promise.resolve(returnObject)
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }
  handleError(error: Error | unknown) {
    console.error('Provider.ChildrenResidenceChange.Children:', error)
    return Promise.reject('Failed to fetch children')
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: NationalRegistry): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
