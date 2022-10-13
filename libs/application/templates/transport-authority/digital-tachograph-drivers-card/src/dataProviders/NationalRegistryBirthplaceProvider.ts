import { NationalRegistryPerson } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
} from '@island.is/application/types'
import { m } from '../lib/messages'
import { GET_BIRTHPLACE } from '../graphql/queries'

export interface BirthplaceProvider {
  location: string | null | undefined
  municipalityCode: string | null | undefined
}

export class NationalRegistryBirthplaceProvider extends BasicDataProvider {
  type = 'NationalRegistryBirthplaceProvider'

  async provide(): Promise<BirthplaceProvider> {
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

        const nationalRegistryUser: NationalRegistryPerson =
          response.data.nationalRegistryUserV2

        return Promise.resolve({
          location: nationalRegistryUser?.birthplace?.location,
          municipalityCode: nationalRegistryUser?.birthplace?.municipalityCode,
        })
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
