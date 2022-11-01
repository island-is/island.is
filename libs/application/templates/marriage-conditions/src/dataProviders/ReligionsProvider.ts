import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/types'
import { m } from '../lib/messages'

export interface Religions {
  name: string
  code: string
}

export class ReligionsProvider extends BasicDataProvider {
  type = 'ReligionsProvider'

  async provide(): Promise<Religions[]> {
    const query = `
    query nationalRegistryReligions {
      nationalRegistryReligions{
        name
        code
      }
    }
      `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }
        return Promise.resolve(response.data.nationalRegistryReligions)
      })
      .catch((error) => this.handleError(error))
  }

  handleError(_error: any) {
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
