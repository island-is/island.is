import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
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
          citizenship
          address {
            code
            postalCode
            city
            streetAddress
          }
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError()
        }

        return Promise.resolve(response.data.nationalRegistryUser)
      })
      .catch(() => {
        return this.handleError()
      })
  }

  handleError() {
    return Promise.resolve({})
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
