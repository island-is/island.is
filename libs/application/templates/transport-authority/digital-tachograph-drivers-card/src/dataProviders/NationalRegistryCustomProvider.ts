import { NationalRegistryUser } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
} from '@island.is/application/types'
import { GET_BIRTHPLACE_AND_DOMICILE } from '../graphql/queries'
import { m } from '../lib/messagesx'

export class NationalRegistryCustomProvider extends BasicDataProvider {
  type = 'NationalRegistryCustomProvider'

  async provide(): Promise<NationalRegistryUser> {
    return this.useGraphqlGateway(GET_BIRTHPLACE_AND_DOMICILE).then(
      async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return Promise.reject({
            reason: `graphql error in ${this.type}: ${response.errors[0].message}`,
          })
        }

        const data = response.data as {
          nationalRegistryUser: NationalRegistryUser | null
        }

        const domicileCode = response.data.nationalRegistryUser?.address?.code
        if (!domicileCode || domicileCode.substr(0, 2) === '99') {
          return Promise.reject({
            reason:
              m.nationalRegistryDomicileProviderErrorMissing.defaultMessage,
          })
        }

        return Promise.resolve(response.data.nationalRegistryUser)
      },
    )
    // .catch(() => {
    //   return Promise.reject({})
    // })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
