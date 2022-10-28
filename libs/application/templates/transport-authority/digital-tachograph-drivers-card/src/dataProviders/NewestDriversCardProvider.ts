import { QualityPhotoAndSignature } from '../types/schema'
import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  StaticText,
} from '@island.is/application/types'
import { GET_NEWEST_DRIVERS_CARD } from '../graphql/queries'

export class NewestDriversCardProvider extends BasicDataProvider {
  type = 'NewestDriversCardProvider'

  async provide(): Promise<QualityPhotoAndSignature> {
    return this.useGraphqlGateway(GET_NEWEST_DRIVERS_CARD).then(
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

        return Promise.resolve(response.data.digitalTachographNewestDriversCard)
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
