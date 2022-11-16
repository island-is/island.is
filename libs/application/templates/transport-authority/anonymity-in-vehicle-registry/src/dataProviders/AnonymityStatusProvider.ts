import {
  BasicDataProvider,
  FailedDataProviderResult,
  StaticText,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'
import { GET_ANONYMITY_STATUS } from '../graphql/queries'
import { AnonymityStatus } from '@island.is/api/schema'

export class AnonymityStatusProvider extends BasicDataProvider {
  type = 'AnonymityStatusProvider'

  async provide(): Promise<AnonymityStatus> {
    return this.useGraphqlGateway(GET_ANONYMITY_STATUS).then(
      async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response?.data?.getAnonymityStatus)
      },
    )
    // .catch((error) => {
    //   return Promise.reject(error)
    // })
  }

  handleError(error: Error) {
    console.error(error)
    return Promise.reject({ reason: 'Failed to fetch data' })
  }

  onProvideError(error: { reason: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: error.reason,
      status: 'failure' as const,
    }
  }

  onProvideSuccess(result: AnonymityStatus): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: result,
      status: 'success',
    }
  }
}
