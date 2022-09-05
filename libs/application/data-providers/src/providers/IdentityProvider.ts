import { coreErrorMessages } from '@island.is/application/core'
import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { NationalRegistryUser, RskCompany } from '@island.is/api/schema'

export class IdentityProvider extends BasicDataProvider {
  type = 'IdentityProvider'

  async provide(
    _application: Application,
  ): Promise<RskCompany | NationalRegistryUser> {
    const query = `
      query IdentityQuery {
        identity {
          nationalId, 
          name, 
          address {
            streetAddress, 
            city, 
            postalCode
          }
        }  
      }
    `
    return this.useGraphqlGateway(query).then(async (res: Response) => {
      const response = await res.json()
      if (response.errors) {
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }
      return Promise.resolve(response.data.identity)
    })
  }

  onProvideError(_result: unknown): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: coreErrorMessages.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
