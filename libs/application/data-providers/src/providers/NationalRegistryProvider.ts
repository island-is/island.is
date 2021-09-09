import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  coreErrorMessages,
} from '@island.is/application/core'
import { NationalRegistryUser } from '@island.is/api/schema'

export class NationalRegistryProvider extends BasicDataProvider {
  type = 'NationalRegistryProvider'

  async provide(application: Application): Promise<NationalRegistryUser> {
    const query = `
      query NationalRegistryUserQuery {
        nationalRegistryUser {
          nationalId
          age
          fullName
          citizenship {
            code
            name
          }
          legalResidence
          address {
            code
            postalCode
            city
            streetAddress
            lastUpdated
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

      return Promise.resolve(response.data.nationalRegistryUser)
    })
  }

  onProvideError(result: unknown): FailedDataProviderResult {
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
