import { NationalRegistryUser } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { GET_BIRTHPLACE } from '../graphql/queries'

export class NationalRegistryBirthplaceProvider extends BasicDataProvider {
  type = 'NationalRegistryBirthplaceProvider'

  async provide(): Promise<NationalRegistryUser> {
    return this.useGraphqlGateway(GET_BIRTHPLACE)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return Promise.reject({
            reason: `graphql error in ${this.type}: ${response.errors[0].message}`,
          })
        }

        return Promise.resolve(response.data.nationalRegistryUser)
      })
      .catch(() => {
        return Promise.reject({})
      })
  }

  onProvideError({ reason }: { reason: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: reason,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
