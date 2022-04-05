import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { Will } from '../types'
import { m } from '../lib/messages'

export class WillProvider extends BasicDataProvider {
  type = 'WillProvider'

  async provide(): Promise<Will> {
    // TODO implement
    return Promise.resolve({ nationalId: '1111111111', hasWill: true })
    /*
    const query = `
        query GetWill {
          getWill {
            nationalId
            hasWill
          }
        }
      `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }
        const data = response.data.getPrenup
        const will: Will = {
          hasWill: data.hefurErfdaskra
        }

        return Promise.resolve(will)
      })
      .catch((error) => this.handleError(error))
      */
  }

  handleError(error: any) {
    return Promise.reject({})
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
