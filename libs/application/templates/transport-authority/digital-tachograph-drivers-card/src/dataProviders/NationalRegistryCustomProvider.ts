import { NationalRegistryUser } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
} from '@island.is/application/types'
import { GET_BIRTHPLACE_AND_DOMICILE } from '../graphql/queries'
import { externalData } from '../lib/messages'

export class NationalRegistryCustomProvider extends BasicDataProvider {
  type = 'NationalRegistryCustomProvider'

  async provide(): Promise<NationalRegistryUser | null> {
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
        const nationalRegistryUserData = data?.nationalRegistryUser

        // TODOx add back, this was removed while testing locally
        // // Make sure user has domicile country as Iceland
        // const domicileCode = nationalRegistryUserData?.address?.code
        // if (!domicileCode || domicileCode.substring(0, 2) === '99') {
        //   return Promise.reject({
        //     reason: externalData.nationalRegistryCustom.missing.defaultMessage,
        //   })
        // }

        return Promise.resolve(nationalRegistryUserData)
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
